import { exec } from 'node:child_process'
import { app, ipcMain } from 'electron'
import { showLyricWindow } from './window/lyric.ts'

export function registerIpcHandlers() {
  ipcMain.handle('app:getVersion', () => app.getVersion())
  ipcMain.handle('app:showLyricWindow', () => {
    showLyricWindow()
  })
  ipcMain.handle('app:typeText', (event, text: string) => {
    exec(`powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${text}')"`)
  })
}
