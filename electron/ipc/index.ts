import { ipcMain } from 'electron'
import { createWindow } from '../windows/index.ts'

export function registerIpcHandlers() {
  ipcMain.handle('window:open', async (_event, payload: { name: string, url: string }) => {
    const url = new URL(payload.url)

    await createWindow(payload.name, url.href, {
      width: 1440,
      height: 900,
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#FFFFFF',
        symbolColor: '#000000',
      },
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
      },
    })
  })
}
