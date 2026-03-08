import type { Application } from '../../shared/types/recognize.ts'
import { execSync, spawn } from 'node:child_process'

/**
 * 获取应用列表
 *
 * @returns apps
 */
export function getApplications(): Application[] {
  const stdout = execSync(
    'powershell -NoProfile -command "[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8; Get-StartApps | ConvertTo-Json"',
    { maxBuffer: 10 * 1024 * 1024 },
  ).toString()

  if (!stdout.trim()) {
    return []
  }

  const apps = JSON.parse(stdout) as Array<{ Name: string, AppID: string }>

  return apps.map(app => ({
    name: app.Name,
    appId: app.AppID,
  }))
}

/**
 * 启动应用
 *
 * @param appId appId
 */
export function launchApplication(appId: string) {
  spawn('explorer.exe', [`shell:AppsFolder\\${appId}`], {
    detached: true,
    stdio: 'ignore',
  })
}
