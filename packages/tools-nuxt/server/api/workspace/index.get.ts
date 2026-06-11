import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const WORKSPACE_DIR = 'C:\\Users\\User\\workspace'

export default defineEventHandler(async (): Promise<WorkspaceProject[]> => {
  try {
    const entries = await readdir(WORKSPACE_DIR)
    const stats = await Promise.allSettled(
      entries.map(name => stat(join(WORKSPACE_DIR, name))),
    )
    return entries.flatMap((name, index) => {
      const result = stats[index]!
      if (result.status === 'fulfilled' && result.value.isDirectory()) {
        return [{
          name,
          path: join(WORKSPACE_DIR, name),
        }]
      }
      return []
    })
  }
  catch (err) {
    console.error('获取工作区项目列表失败:', err)
    return []
  }
})
