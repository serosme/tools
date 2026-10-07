import { unlink } from 'node:fs/promises'
import { defineEventHandler } from 'nuxt/server'

export default defineEventHandler(async (event) => {
  await unlink(musicPath(musicId(event)))
})
