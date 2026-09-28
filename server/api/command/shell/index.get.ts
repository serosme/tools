export default defineEventHandler((): { name: string }[] => {
  return getShellNames()
})
