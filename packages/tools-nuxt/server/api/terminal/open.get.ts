import { spawn } from 'node:child_process'

export default defineEventHandler(async (event): Promise<{ success: boolean }> => {
  const query = getQuery(event)
  const name = query.name as string | undefined

  if (!name) {
    console.error('终端打开失败: name 参数缺失')
    return { success: false }
  }

  const profiles = getTerminalProfiles()
  if (!profiles.includes(name)) {
    console.error('终端打开失败: 未找到配置文件:', name)
    return { success: false }
  }

  const terminalPath = getTerminalPath()
  if (!terminalPath) {
    console.error('终端打开失败: 未找到 wt.exe 路径')
    return { success: false }
  }

  try {
    const child = spawn(terminalPath, ['-p', name], {
      detached: true,
      stdio: 'ignore',
    })
    child.unref()
    return { success: true }
  }
  catch (err) {
    console.error('终端打开失败:', err)
    return { success: false }
  }
})
