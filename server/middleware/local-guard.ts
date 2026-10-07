import { createError, defineEventHandler, getRequestHeader, getRequestURL } from 'nuxt/server'

export default defineEventHandler((event) => {
  const { pathname } = getRequestURL(event)
  if (!pathname.startsWith('/api'))
    return

  const host = (getRequestHeader(event, 'host') ?? '').replace(/:\d+$/, '')
  const origin = getRequestHeader(event, 'sec-fetch-site')

  const local = host === 'localhost' || host === '127.0.0.1' || host === '[::1]'
  if (!local || (origin && origin !== 'same-origin'))
    throw createError({ status: 400, statusText: 'Invalid origin' })
})
