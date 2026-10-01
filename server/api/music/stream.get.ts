import { createReadStream, statSync } from 'node:fs'
import { extname } from 'node:path'

const mime: Record<string, string> = {
  '.flac': 'audio/flac',
  '.mp3': 'audio/mpeg',
}

export default defineEventHandler((event) => {
  const id = musicId(event)
  const path = musicPath(id)
  const size = statSync(path).size
  const range = getHeader(event, 'range')

  setHeader(event, 'Content-Type', mime[extname(id).toLowerCase()]!)
  setHeader(event, 'Accept-Ranges', 'bytes')

  if (!range) {
    setHeader(event, 'Content-Length', size)
    return createReadStream(path)
  }

  const [, from = '0', to] = /bytes=(\d+)-(\d*)/.exec(range) ?? []
  const start = Number(from)

  // 起点超出文件末尾（标签重写后文件变短就会发生）必须拒绝，否则算出负的 Content-Length 把请求挂死
  if (start >= size) {
    setHeader(event, 'Content-Range', `bytes */${size}`)
    throw createError({ statusCode: 416 })
  }

  const end = Math.max(start, Math.min(to ? Number(to) : size - 1, size - 1))

  setResponseStatus(event, 206)
  setHeader(event, 'Content-Range', `bytes ${start}-${end}/${size}`)
  setHeader(event, 'Content-Length', end - start + 1)

  return createReadStream(path, { start, end })
})
