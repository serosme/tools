import { app, globalShortcut, Menu } from 'electron'
import { pathIpc } from './ipc/path.js'
import { relayIpc } from './ipc/relay.js'
import { windowIpc } from './ipc/window.js'
import { createAppTray } from './tray/index.js'
import { startRendererProcess } from './utils/window.js'
import { useCommand } from './window/command.js'

// 移除默认菜单栏
Menu.setApplicationMenu(null)

app.whenReady().then(async () => {
  // 启动渲染进程
  startRendererProcess()

  // 启动命令面板
  const { create, toggle } = useCommand()
  await create()

  // 注册 IPC
  pathIpc()
  windowIpc()
  relayIpc()

  // 注册全局快捷键
  globalShortcut.register('Alt+Space', () => toggle())

  // 创建系统托盘
  createAppTray(
    () => {},
    {
      label: '退出',
      click: () => {
        app.quit()
      },
    },
  )
})
