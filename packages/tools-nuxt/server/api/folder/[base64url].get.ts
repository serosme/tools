import { spawn } from 'node:child_process'

export default defineEventHandler(async (event): Promise<{ success: boolean }> => {
  const base64url = getRouterParam(event, 'base64url')

  if (!base64url) {
    return { success: false }
  }

  try {
    const dir = base64urlDecode(base64url)
    const child = spawn('explorer.exe', [dir], {
      detached: true,
      stdio: 'ignore',
    })
    child.unref()
    return { success: true }
  }
  catch {
    return { success: false }
  }
})
