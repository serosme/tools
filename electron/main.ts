import { app } from 'electron'
import { registerIpcHandlers } from './ipc.ts'
import { createAppTray } from './tray.ts'
import { createMainWindow, removeCloseListener, showMainWindow } from './window.ts'

// 注册 IPC 处理器
registerIpcHandlers()

app.whenReady().then(() => {
  // 创建主窗口
  createMainWindow()

  // 创建系统托盘
  createAppTray(
    () => showMainWindow(),
    {
      label: '主窗口',
      click: () => showMainWindow(),
    },
    {
      type: 'separator',
    },
    {
      label: '退出',
      click: () => {
        removeCloseListener()
        app.quit()
      },
    },
  )
})

app.on('window-all-closed', () => {
  // 阻止应用在所有窗口关闭时退出
})
