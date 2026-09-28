export default defineEventHandler((): { name: string }[] => {
  return getApplicationNames()
})
