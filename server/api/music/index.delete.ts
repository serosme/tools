import { unlink } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
  await unlink(musicPath(musicId(event)))
})
