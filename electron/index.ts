import { app, globalShortcut } from 'electron'
import { registerIpcHandlers } from './ipc/index.ts'
import { startServer } from './server/index.ts'
import { createTray } from './tray/index.ts'
import { createCommandWindow } from './windows/command.ts'
import { toggleWindow } from './windows/index.ts'

app.whenReady().then(async () => {
  // 启动渲染服务
  await startServer()

  // 注册 IPC
  registerIpcHandlers()

  // 创建命令面板窗口
  const commandWindow = await createCommandWindow()

  // 命令面板失焦自动隐藏
  commandWindow.on('blur', () => commandWindow.hide())

  // Alt+Space 唤出命令面板
  globalShortcut.register('Alt+Space', () => toggleWindow(commandWindow))

  // 创建常驻托盘
  createTray()
})
