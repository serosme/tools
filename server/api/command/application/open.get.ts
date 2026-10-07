import { defineEventHandler, getQuery } from 'nuxt/server'

export default defineEventHandler((event) => {
  const { name } = getQuery<{ name: string }>(event)
  spawnProcess('explorer.exe', [`shell:AppsFolder\\${getApplicationId(name)}`])
})
