import type { StoreSchema } from 'tools-shared'

export default defineEventHandler((event): StoreSchema[keyof StoreSchema] => {
  const key = getRouterParam(event, 'key') as keyof StoreSchema
  if (!key || !conf.has(key)) {
    throw createError({ statusCode: 404, message: 'Conf not found' })
  }
  return conf.get(key) as StoreSchema[typeof key]
})
