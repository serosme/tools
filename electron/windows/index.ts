import type { BrowserWindowConstructorOptions } from 'electron'
import { app, BrowserWindow } from 'electron'

// 标记应用是否正在退出，用来区分「关窗隐藏」和「退出时真关窗」
let quitting = false
const windows = new Map<string, BrowserWindow>()

// 退出流程开始后不再拦截关窗
app.on('before-quit', () => {
  quitting = true
})

// 按名字创建窗口，已存在则聚焦，showOnReady 让窗口等页面可渲染再显示
export async function createWindow(
  name: string,
  url: string,
  options: BrowserWindowConstructorOptions,
  { showOnReady = false } = {},
) {
  // 同名窗口存在则聚焦
  const existing = windows.get(name)
  if (existing) {
    existing.focus()
    return existing
  }

  const win = new BrowserWindow(options)

  // 避免白屏闪烁
  if (showOnReady)
    win.once('ready-to-show', () => win.show())

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
