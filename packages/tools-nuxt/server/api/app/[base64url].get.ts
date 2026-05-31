import { spawn } from 'node:child_process'

export default defineEventHandler(async (event): Promise<{ success: boolean }> => {
  const base64url = getRouterParam(event, 'base64url')

  if (!base64url) {
    return { success: false }
  }

  try {
    const id = base64urlDecode(base64url)

    const child = spawn('explorer.exe', [`shell:AppsFolder\\${id}`], {
      detached: true,
      stdio: 'ignore',
    })

    child.unref()

    return { success: true }
  }
  catch (error) {
    console.error(error)
    return { success: false }
  }
})
