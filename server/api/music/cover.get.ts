import { createError, defineEventHandler } from 'nuxt/server'
import { findPictureByType, readPictures } from 'taglib-wasm/simple'

export default defineEventHandler(async (event) => {
  const pictures = await readPictures(musicPath(musicId(event)))
  const picture = findPictureByType(pictures, 'FrontCover') || pictures[0]

  if (!picture)
    throw createError({ status: 400, statusText: 'No cover art' })

  // body 用 Uint8Array<ArrayBuffer> 以满足 BodyInit，避免 ArrayBufferLike 泛型不兼容
  return new Response(new Uint8Array(picture.data), {
    headers: {
      'Content-Type': picture.mimeType,
      'Cache-Control': 'public, max-age=31536000',
    },
  })
})
