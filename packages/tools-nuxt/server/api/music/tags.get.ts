import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineEventHandler } from 'h3'
import { readTags } from 'taglib-wasm/simple'

const musicDir = conf.get('music').path

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event) as { id: string }
  const path = join(musicDir, id)
  const buffer = await readFile(path)
  const tags = await readTags(buffer)

  return {
    title: tags.title?.find(() => true) || '',
    artist: tags.artist?.find(() => true) || '',
    album: tags.album?.find(() => true) || '',
  }
})
