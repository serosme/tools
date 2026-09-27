import { app } from 'electron'
import { APP_URL, startServer } from './server/index.ts'
import { createTray } from './tray/index.ts'
import { createWindow } from './windows/index.ts'

app.whenReady().then(async () => {
  // 创建常驻托盘
  createTray()

  // 启动渲染服务
  await startServer()

  // 创建主窗口
  await createWindow('Main', APP_URL, {
    width: 1280,
    height: 800,
    show: false,
    autoHideMenuBar: true,
  }, { showOnReady: true })
})
