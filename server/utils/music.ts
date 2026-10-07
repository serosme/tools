import type { H3Event } from 'h3'
import { basename, extname, join } from 'node:path'

export const musicExts = new Set(['.mp3', '.flac'])

// 延迟到首次使用时读取配置：配置文件缺失/损坏不应导致整个服务启动失败
export function musicDir(): string {
  return readConf().music.path
}

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

  return join(musicDir(), id)
}
