import { fileURLToPath } from 'node:url'
import { BrowserWindow } from 'electron'

export function createWindow(routePath: string): number {
  const newWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#FFFFFF',
      symbolColor: '#000000',
    },
    webPreferences: {
      preload: fileURLToPath(new URL('../preload.js', import.meta.url)),
      sandbox: false,
      webSecurity: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  newWindow.loadURL(`http://localhost:3000${routePath}`)
  newWindow.webContents.openDevTools()

  return newWindow.id
}

export function closeWindow(id: number): boolean {
  const win = BrowserWindow.fromId(id)
  if (!win)
    return false
  win.close()
  return true
}
