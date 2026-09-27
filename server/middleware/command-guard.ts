export default defineEventHandler((event) => {
  if (!getRequestURL(event).pathname.startsWith('/api/command/'))
    return

  const fetchSite = getHeader(event, 'sec-fetch-site')
  if (fetchSite && fetchSite !== 'same-origin')
    throw createError({ statusCode: 400, message: '非法来源' })

  const host = (getHeader(event, 'host') ?? '').replace(/:\d+$/, '')
  if (host !== 'localhost' && host !== '127.0.0.1' && host !== '[::1]')
    throw createError({ statusCode: 400, message: '非法来源' })
})
