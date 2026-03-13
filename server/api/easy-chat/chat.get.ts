export default defineEventHandler(async (event) => {
  const message: string = (getQuery(event).message || '').toString()
  const rsp = await $fetch(`http://localhost:8080/easy-chat/chat?message=${encodeURIComponent(message)}`)
  return rsp
})
