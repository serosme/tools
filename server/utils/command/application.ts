import { execSync } from 'node:child_process'

interface ApplicationItem {
  name: string
  id: string
}

let lastApplications: ApplicationItem[]

function getAllApplications(): ApplicationItem[] {
  const stdout = execSync(
    'powershell -NoProfile -command "[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8; Get-StartApps | ConvertTo-Json"',
    { maxBuffer: 1 * 1024 * 1024 },
  ).toString()

  const applications = JSON.parse(stdout) as Array<{ Name: string, AppID: string }>

  lastApplications = [...new Map(applications.map(a => [a.Name, a])).values()]
    .map(a => ({ name: a.Name, id: a.AppID }))
  return lastApplications
}

export function getApplicationNames(): { name: string }[] {
  return getAllApplications().map(a => ({ name: a.name }))
}

export function getApplicationId(name: string): string {
  return lastApplications.find(a => a.name === name)!.id
}
