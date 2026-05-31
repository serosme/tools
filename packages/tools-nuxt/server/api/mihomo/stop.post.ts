export default defineEventHandler(async () => {
  const result = await stopMihomo()
  if (!result.success) {
    throw createError({ statusCode: 400, message: result.message })
  }
  return result
})
