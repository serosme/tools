import type { BrowserWindow, Tray } from 'electron'
import { app } from 'electron'
import { registerIpcHandlers } from './ipc.ts'
import { createAppTray } from './tray.ts'
import { createMainWindow, showMainWindow } from './window.ts'

let mainWindow: BrowserWindow | null = null
let _tray: Tray | null = null

function handleCloseToTray(event: Electron.Event) {
  event.preventDefault()
  mainWindow?.hide()
}

// 注册 IPC 处理器
registerIpcHandlers()

app.whenReady().then(() => {
  // 创建主窗口
  mainWindow = createMainWindow()
  mainWindow.on('close', handleCloseToTray)

  // 创建系统托盘
  _tray = createAppTray(
    () => showMainWindow(mainWindow),
    {
      label: '主窗口',
      click: () => showMainWindow(mainWindow),
    },
    {
      type: 'separator',
    },
    {
      label: '退出',
      click: () => {
        mainWindow?.removeAllListeners('close')
        app.quit()
      },
    },
  )
})

app.on('window-all-closed', () => {
  // 阻止应用在所有窗口关闭时退出
})
