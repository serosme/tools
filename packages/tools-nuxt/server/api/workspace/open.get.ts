import { spawn } from 'node:child_process'
import { access } from 'node:fs/promises'
import process from 'node:process'

const CODE_PATH = `${process.env.USERPROFILE}\\scoop\\apps\\vscode\\current\\Code.exe`
const IDEA_PATH = `${process.env.USERPROFILE}\\scoop\\apps\\idea\\current\\IDE\\bin\\idea64.exe`

export default defineEventHandler(async (event): Promise<{ success: boolean }> => {
  const query = getQuery(event)
  const path = query.path as string | undefined
  const type = (query.type as string) || 'terminal'

  if (!path) {
    console.error('打开项目失败: path 参数缺失')
    return { success: false }
  }

  if (!['terminal', 'vscode', 'idea'].includes(type)) {
    console.error('打开项目失败: 无效的 type 参数:', type)
    return { success: false }
  }

  try {
    const dir = decodeURIComponent(path)
    await access(dir)

    if (type === 'vscode') {
      const child = spawn(CODE_PATH, [dir], {
        detached: true,
        stdio: 'ignore',
      })
      child.on('error', (err) => {
        console.error('启动 VS Code 失败:', err)
      })
      child.unref()
    }
    else if (type === 'idea') {
      const child = spawn(IDEA_PATH, [dir], {
        detached: true,
        stdio: 'ignore',
      })
      child.on('error', (err) => {
        console.error('启动 IDEA 失败:', err)
      })
      child.unref()
    }
    else {
      const terminalPath = getTerminalPath()
      if (!terminalPath) {
        console.error('打开项目失败: 未找到 wt.exe 路径')
        return { success: false }
      }
      const child = spawn(terminalPath, ['-d', dir, '-p', 'PowerShell'], {
        detached: true,
        stdio: 'ignore',
      })
      child.on('error', (err) => {
        console.error('启动终端失败:', err)
      })
      child.unref()
    }
    return { success: true }
  }
  catch (err) {
    console.error('打开项目失败:', err)
    return { success: false }
  }
})
