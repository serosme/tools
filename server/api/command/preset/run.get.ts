import { defineEventHandler, getQuery } from 'nuxt/server'

export default defineEventHandler((event) => {
  const { label } = getQuery<{ label: string }>(event)
  runPreset(label)
})
