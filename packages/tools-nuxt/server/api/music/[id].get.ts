import { createReadStream, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { defineEventHandler, getHeader, setHeader, setResponseStatus } from 'h3'

const musicDir = conf.get('music').path

const mime: Record<string, string> = {
  '.flac': 'audio/flac',
  '.mp3': 'audio/mpeg',
}

export default defineEventHandler<{ routerParams: { id: string } }>((event) => {
  const { id } = getRouterParams(event) as { id: string }
  if (!id) {
    return
  }

  const name = base64urlDecode(id)
  const path = join(musicDir, name)
  const size = statSync(path).size
  const range = getHeader(event, 'range')

  setHeader(event, 'Content-Type', mime[extname(name)] || 'application/octet-stream')
  setHeader(event, 'Accept-Ranges', 'bytes')

  if (!range) {
    setHeader(event, 'Content-Length', size)
    return createReadStream(path)
  }

  const [, startStr, endStr] = range.match(/bytes=(\d+)-(\d*)/) || []
  const start = Number(startStr)
  const end = endStr ? Number(endStr) : size - 1

  setResponseStatus(event, 206)
  setHeader(event, 'Content-Range', `bytes ${start}-${end}/${size}`)
  setHeader(event, 'Content-Length', end - start + 1)

  return createReadStream(path, { start, end })
})
