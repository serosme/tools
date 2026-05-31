import { execSync } from 'node:child_process'

export default defineEventHandler((): Application[] => {
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
    base64url: base64urlEncode(app.AppID),
  }))
})
