import { defineEventHandler } from 'nuxt/server'
import { readTags } from 'taglib-wasm/simple'

function hideBinary(_key: string, value: unknown) {
  return value instanceof Uint8Array ? `<binary ${value.byteLength} bytes>` : value
}

export default defineEventHandler(async (event) => {
  const tags = await readTags(musicPath(musicId(event)))

  return {
    tags: {
      title: tags.title?.[0] || '',
      artist: tags.artist?.[0] || '',
      album: tags.album?.[0] || '',
      lyrics: tags.lyrics?.map(l => l.text).join('\n\n') || '',
    },
    info: JSON.stringify(tags, hideBinary, 2),
  }
})
