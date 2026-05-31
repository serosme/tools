import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { defineEventHandler } from 'h3'
import { readProperties, readTags } from 'taglib-wasm/simple'

const musicDir = conf.get('music').path
const exts = new Set(['.mp3', '.flac'])

export default defineEventHandler(async (): Promise<Music[]> => {
  const result: Music[] = []

  const files = await readdir(musicDir)

  for (const file of files) {
    if (!exts.has(extname(file).toLowerCase()))
      continue

    const buffer = await readFile(join(musicDir, file))
    const properties = await readProperties(buffer)
    const tags = await readTags(buffer)

    result.push({
      id: base64urlEncode(file),
      index: files.indexOf(file),
      title: tags.title?.find(() => true) || '未知歌曲',
      artist: tags.artist?.find(() => true) || '未知艺术家',
      duration: properties.duration,
    })
  }
  return result
})
