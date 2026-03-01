import { app, ipcMain } from 'electron'

export function registerIpcHandlers() {
  ipcMain.handle('app:getVersion', () => app.getVersion())
}
