import { exec } from 'node:child_process'
import { ipcMain } from 'electron'
import { getApplications, launchApplication } from './utils/applications.ts'
import { showLyricWindow } from './window/lyric.ts'

export function registerIpcHandlers() {
  ipcMain.handle('app:showLyricWindow', () => {
    showLyricWindow()
  })
  ipcMain.on('app:typeText', (event, text: string) => {
    exec(`powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${text}')"`)
  })

  // 获取应用列表 IPC 处理器
  ipcMain.handle('app:getApplications', () => {
    return getApplications()
  })
  // 启动应用 IPC 处理器
  ipcMain.on('app:launchApplication', (event, appId: string) => {
    launchApplication(appId)
  })
}
