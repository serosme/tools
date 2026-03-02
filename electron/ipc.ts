import { app, ipcMain } from 'electron'
import { showLyricWindow } from './window/lyric.ts'

export function registerIpcHandlers() {
  ipcMain.handle('app:getVersion', () => app.getVersion())
  ipcMain.handle('app:showLyricWindow', () => {
    showLyricWindow()
  })
}
