import { readFile, writeFile } from 'node:fs/promises'
import { clearTags } from 'taglib-wasm/simple'

export default defineEventHandler(async (event) => {
  const path = musicPath(musicId(event))
  const stripped = await clearTags(await readFile(path))

  await writeFile(path, stripped)
})
