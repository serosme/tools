import { writeFile } from 'node:fs/promises'
import { defineEventHandler } from 'nuxt/server'
import { clearTags } from 'taglib-wasm/simple'

export default defineEventHandler(async (event) => {
  const path = musicPath(musicId(event))
  const stripped = await clearTags(path)

  await writeFile(path, stripped)
})
