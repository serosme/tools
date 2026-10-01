import type { BrowserWindowConstructorOptions } from 'electron'
import { app, BrowserWindow } from 'electron'

// 标记应用是否正在退出，用来区分「关窗隐藏」和「退出时真关窗」
let quitting = false
const windows = new Map<string, BrowserWindow>()

// 退出流程开始后不再拦截关窗
app.on('before-quit', () => {
  quitting = true
})

// 创建窗口
export async function createWindow(name: string, url: string, options: BrowserWindowConstructorOptions) {
  // 同名窗口存在时不重新创建
  const existing = windows.get(name)
  if (existing) {
    existing.show()
    existing.focus()
    return existing
  }

  const win = new BrowserWindow({ title: name, ...options })

  // 关窗只是隐藏，继续留在托盘
  win.on('close', (event) => {
    if (quitting)
      return
    event.preventDefault()
    win.hide()
  })

  win.on('closed', () => windows.delete(name))

  windows.set(name, win)
  await win.loadURL(url)
  return win
}

// 获取所有窗口
export function getWindows() {
  return [...windows.entries()].map(([name, win]) => ({ name, win }))
}

// 显示或隐藏窗口
export function toggleWindow(win: BrowserWindow) {
  if (win.isVisible() && !win.isMinimized()) {
    win.hide()
  }
  else {
    win.show()
    win.focus()
  }
}
