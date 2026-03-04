import { exec } from 'node:child_process'
import { ipcMain } from 'electron'
import { showLyricWindow } from './window/lyric.ts'

export function registerIpcHandlers() {
  ipcMain.handle('app:showLyricWindow', () => {
    showLyricWindow()
  })
  ipcMain.on('app:typeText', (event, text: string) => {
    exec(`powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${text}')"`)
  })
}
