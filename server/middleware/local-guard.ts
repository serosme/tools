export default defineEventHandler((event) => {
  const { pathname } = getRequestURL(event)
  if (!pathname.startsWith('/api'))
    return

  const host = (getHeader(event, 'host') ?? '').replace(/:\d+$/, '')
  const origin = getHeader(event, 'sec-fetch-site')

  const local = host === 'localhost' || host === '127.0.0.1' || host === '[::1]'
  if (!local || (origin && origin !== 'same-origin'))
    throw createError({ statusCode: 400, message: 'Invalid origin' })
})
