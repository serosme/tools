import { Buffer } from 'node:buffer'
import { defineEventHandler } from 'nuxt/server'

export default defineEventHandler(async (event) => {
  const audio = Buffer.from(await event.req.arrayBuffer())
  return { text: await transcribe(audio) }
})
