import { createReadStream, statSync } from 'node:fs'
import { extname } from 'node:path'
import { Readable } from 'node:stream'
import { createError, defineEventHandler, getRequestHeader } from 'nuxt/server'

const mime: Record<string, string> = {
  '.flac': 'audio/flac',
  '.mp3': 'audio/mpeg',
}

// Node 的 Readable 与 DOM 的 ReadableStream 类型声明不兼容，运行时同构，断言即可
function toWebStream(stream: Readable): ReadableStream {
  return Readable.toWeb(stream) as unknown as ReadableStream
}

export default defineEventHandler((event) => {
  const id = musicId(event)
  const path = musicPath(id)
  const size = statSync(path).size
  const range = getRequestHeader(event, 'range')

  const headers = {
    'Content-Type': mime[extname(id).toLowerCase()]!,
    'Accept-Ranges': 'bytes',
  }

  if (!range) {
    return new Response(toWebStream(createReadStream(path)), {
      headers: { ...headers, 'Content-Length': String(size) },
    })
  }

  const [, from = '0', to] = /bytes=(\d+)-(\d*)/.exec(range) ?? []
  const start = Number(from)

  // 起点超出文件末尾（标签重写后文件变短就会发生）必须拒绝，否则算出负的 Content-Length 把请求挂死
  if (start >= size) {
    event.res.headers.set('Content-Range', `bytes */${size}`)
    throw createError({ status: 416, statusText: 'Range Not Satisfiable' })
  }

  const end = Math.max(start, Math.min(to ? Number(to) : size - 1, size - 1))

  return new Response(toWebStream(createReadStream(path, { start, end })), {
    status: 206,
    headers: {
      ...headers,
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
    },
  })
})
