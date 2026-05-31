export default defineEventHandler(async (event) => {
  const body = await readBody<{ admin?: boolean }>(event)
  const result = await startMihomo(body?.admin ?? false)
  if (!result.success) {
    throw createError({ statusCode: 400, message: result.message })
  }
  return result
})
