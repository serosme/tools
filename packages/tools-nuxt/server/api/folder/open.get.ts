import { spawn } from 'node:child_process'

export default defineEventHandler(async (event): Promise<{ success: boolean }> => {
  const { path: dir } = getQuery(event) as { path: string }

  if (!dir) {
    return { success: false }
  }

  try {
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
