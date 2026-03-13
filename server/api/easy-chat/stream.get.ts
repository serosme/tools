export default defineEventHandler(async (event) => {
  const message: string = (getQuery(event).message || '').toString()
  const client: string = (getQuery(event).client || '').toString()

  return $fetch(`http://localhost:8080/easy-chat/chat/stream?client=${encodeURIComponent(client)}&message=${encodeURIComponent(message)}`, {
    responseType: 'stream',
    onResponse: async ({ response }) => {
      setResponseHeaders(event, {
        'Content-Type': response.headers.get('content-type') || 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      })
    },
  })
})
