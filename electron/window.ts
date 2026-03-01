import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { app, BrowserWindow } from 'electron'

export function createMainWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: fileURLToPath(new URL('./preload.ts', import.meta.url)),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (app.isPackaged) {
    window.loadFile(path.join(app.getAppPath(), '.output', 'public', 'index.html'))
  }
  else {
    window.loadURL('http://localhost:3000')
    window.webContents.openDevTools()
  }

  return window
}

export function showMainWindow(window: BrowserWindow | null) {
  if (!window)
    return

  if (window.isMinimized())
    window.restore()

  window.show()
  window.focus()
}
