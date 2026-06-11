import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineEventHandler, readBody } from 'h3'
import { applyTags } from 'taglib-wasm/simple'

const musicDir = conf.get('music').path

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event) as { id: string }
  const body = await readBody(event) as { title?: string, artist?: string, album?: string }
  const path = join(musicDir, id)

  const buffer = await readFile(path)
  const modified = await applyTags(buffer, {
    title: body.title || '',
    artist: body.artist || '',
    album: body.album || '',
  })
  await writeFile(path, modified)

  return { success: true }
})
