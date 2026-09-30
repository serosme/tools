import type { BrowserWindow, MenuItemConstructorOptions } from 'electron'
import path from 'node:path'
import { app, Menu, Tray } from 'electron'
import { getWindows } from '../windows/index.ts'

let tray: Tray

// 创建常驻托盘
export function createTray() {
  tray = new Tray(path.join(app.getAppPath(), './public/favicon.ico'))
  refresh()

  // 窗口创建、销毁时重建菜单
  app.on('browser-window-created', (_event, win) => {
    win.on('closed', () => setImmediate(refresh))
    setImmediate(refresh)
  })
}

// 单个窗口的子菜单
function windowMenu(win: BrowserWindow): MenuItemConstructorOptions[] {
  return [
    {
      label: 'Show',
      click: () => {
        win.show()
        win.focus()
      },
    },
    { label: 'DevTools', click: () => win.webContents.toggleDevTools() },
    { type: 'separator' },
    // 使用 destroy 来真正关掉窗口
    { label: 'Close', click: () => win.destroy() },
  ]
}

// 重建托盘菜单
function refresh() {
  tray.setContextMenu(Menu.buildFromTemplate([
    ...getWindows().map(({ name, win }) => ({ label: name, submenu: windowMenu(win) })),
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]))
}
