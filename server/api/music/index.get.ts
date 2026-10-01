import { readdir } from 'node:fs/promises'
import { extname } from 'node:path'
import { readMetadata } from 'taglib-wasm/simple'

export default defineEventHandler(async (): Promise<Music[]> => {
  const files = (await readdir(musicDir))
    .filter(file => musicExts.has(extname(file).toLowerCase()))
    .sort()

  return Promise.all(files.map(async (file) => {
    const { tags, properties, hasCoverArt } = await readMetadata(musicPath(file))

    return {
      id: file,
      title: tags.title?.[0] || 'Unknown Title',
      artist: tags.artist?.[0] || 'Unknown Artist',
      duration: properties!.duration,
      hasCover: hasCoverArt,
    }
  }))
})
