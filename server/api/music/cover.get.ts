import { findPictureByType, readPictures } from 'taglib-wasm/simple'

export default defineEventHandler(async (event) => {
  const pictures = await readPictures(musicPath(musicId(event)))
  const picture = findPictureByType(pictures, 'FrontCover') || pictures[0]

  if (!picture) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No cover art',
    })
  }

  setHeader(event, 'Content-Type', picture.mimeType)
  setHeader(event, 'Cache-Control', 'public, max-age=31536000')

  return picture.data
})
