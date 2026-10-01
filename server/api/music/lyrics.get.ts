import { readTags } from 'taglib-wasm/simple'

export default defineEventHandler(async (event) => {
  const tags = await readTags(musicPath(musicId(event)))

  return { text: tags.lyrics?.map(l => l.text).join('\n\n') || '' }
})
