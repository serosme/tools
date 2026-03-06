import { app, globalShortcut } from 'electron'
import { getStartMenuShortcuts } from './a.ts'
import { registerIpcHandlers } from './ipc.ts'
import { createAppTray } from './tray.ts'
import { createMainWindow, removeCloseListener, showMainWindow, toggleRecord } from './window/main.ts'

// 注册 IPC 处理器
registerIpcHandlers()

app.whenReady().then(() => {
  // 创建主窗口
  createMainWindow()

  // 注册全局快捷键
  globalShortcut.register('Shift+Space', () => toggleRecord())

  // 获取
  const shortcuts = getStartMenuShortcuts()
  console.log(shortcuts)

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
