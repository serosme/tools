import type { H3Event } from 'h3'
import { basename, extname, join } from 'node:path'

export const musicExts = new Set(['.mp3', '.flac'])
export const musicDir = readConf().music.path

export function musicId(event: H3Event): string {
  return (getQuery(event) as { id: string }).id
}

export function musicPath(id: string): string {
  if (basename(id) !== id || !musicExts.has(extname(id).toLowerCase())) {
    throw createError({
      statusCode: 400,
      message: 'Invalid music file',
    })
  }

  return join(musicDir, id)
}
