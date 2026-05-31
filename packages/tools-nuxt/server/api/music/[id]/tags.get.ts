import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineEventHandler } from 'h3'
import { readTags } from 'taglib-wasm/simple'

const musicDir = conf.get('music').path

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event) as { id: string }
  const name = base64urlDecode(id)
  const path = join(musicDir, name)
  const buffer = await readFile(path)
  const tags = await readTags(buffer)

  return {
    title: tags.title?.find(() => true) || '',
    artist: tags.artist?.find(() => true) || '',
    album: tags.album?.find(() => true) || '',
  }
})
