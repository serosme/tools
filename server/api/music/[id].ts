import fs from 'node:fs'
import path from 'node:path'

const MUSIC_DIR = 'D:/Music'
const AUDIO_EXT = /\.(?:mp3|wav|flac|m4a|wma|ogg|aac|webm)$/i

const MIME_TYPES: Record<string, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  flac: 'audio/flac',
  m4a: 'audio/mp4',
  wma: 'audio/x-ms-wma',
  ogg: 'audio/ogg',
  aac: 'audio/aac',
  webm: 'audio/webm',
}

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (Number.isNaN(id))
    throw createError({ statusCode: 400, message: 'Missing or invalid music ID' })

  let files: string[]
  try {
    files = fs.readdirSync(MUSIC_DIR).filter(f => AUDIO_EXT.test(f))
  }
  catch {
    throw createError({ statusCode: 500, message: 'Failed to read music directory' })
  }

  if (id < 0 || id >= files.length)
    throw createError({ statusCode: 404, message: 'Music not found' })

  const filePath = path.join(MUSIC_DIR, files[id])
  let stat: fs.Stats
  try {
    stat = fs.statSync(filePath)
  }
  catch {
    throw createError({ statusCode: 404, message: 'File not found' })
  }

  const ext = path.extname(filePath).slice(1).toLowerCase()
  const mimeType = MIME_TYPES[ext] || 'audio/mpeg'

  const range = getRequestHeader(event, 'range')
  if (range) {
    const [, startStr, endStr] = range.match(/bytes=(\d*)-(\d*)/) || []
    const start = Number(startStr) || 0
    const end = Math.min(Number(endStr) || stat.size - 1, stat.size - 1)

    if (start < 0 || start >= stat.size)
      throw createError({ statusCode: 416, message: 'Range not satisfiable' })

    setResponseStatus(event, 206)
    setResponseHeaders(event, {
      'Content-Type': mimeType,
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Content-Length': (end - start + 1).toString(),
      'Accept-Ranges': 'bytes',
      'ETag': `"${stat.size}-${stat.mtimeMs}"`,
      'Last-Modified': stat.mtime.toUTCString(),
    })

    return sendStream(event, fs.createReadStream(filePath, { start, end }))
  }

  // 完整文件
  setResponseHeaders(event, {
    'Content-Type': mimeType,
    'Content-Length': stat.size.toString(),
    'Accept-Ranges': 'bytes',
    'ETag': `"${stat.size}-${stat.mtimeMs}"`,
    'Last-Modified': stat.mtime.toUTCString(),
  })
  return sendStream(event, fs.createReadStream(filePath))
})
