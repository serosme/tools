import { getTagLib } from 'taglib-wasm/simple'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title: string, artist: string, album: string, lyrics: string }>(event)
  const taglib = await getTagLib()

  await taglib.edit(musicPath(musicId(event)), (audioFile) => {
    audioFile.tag()
      .setTitle(body.title)
      .setArtist(body.artist)
      .setAlbum(body.album)
    audioFile.setLyrics(body.lyrics ? [{ text: body.lyrics }] : [])
  })
})
