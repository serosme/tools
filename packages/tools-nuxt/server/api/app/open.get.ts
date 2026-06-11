import { spawn } from 'node:child_process'

export default defineEventHandler(async (event): Promise<{ success: boolean }> => {
  const { id } = getQuery(event) as { id: string }

  if (!id) {
    return { success: false }
  }

  try {
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
