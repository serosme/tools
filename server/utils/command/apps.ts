import { execSync } from 'node:child_process'

interface ApplicationItem {
  name: string
  id: string
}

let lastApps: ApplicationItem[]

function getAllApps(): ApplicationItem[] {
  const stdout = execSync(
    'powershell -NoProfile -command "[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8; Get-StartApps | ConvertTo-Json"',
    { maxBuffer: 1 * 1024 * 1024 },
  ).toString()

  const apps = JSON.parse(stdout) as Array<{ Name: string, AppID: string }>

  lastApps = [...new Map(apps.map(a => [a.Name, a])).values()]
    .map(a => ({ name: a.Name, id: a.AppID }))
  return lastApps
}

export function getAppNames(): { name: string }[] {
  return getAllApps().map(a => ({ name: a.name }))
}

export function getAppId(name: string): string {
  return lastApps.find(a => a.name === name)!.id
}
