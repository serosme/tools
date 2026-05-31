import type { StoreSchema } from 'tools-shared'

export default defineEventHandler(async (event): Promise<boolean> => {
  const key = getRouterParam(event, 'key') as keyof StoreSchema
  if (!key || !conf.has(key)) {
    throw createError({ statusCode: 404, message: 'Conf not found' })
  }
  const body = await readBody<StoreSchema[typeof key]>(event)
  conf.set(key, body)
  return true
})
