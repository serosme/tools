import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

function getSettingsPath(): string | null {
  try {
    const stdout = execSync(
      'powershell -NoProfile -command "$pkg = Get-AppxPackage -Name Microsoft.WindowsTerminal -ErrorAction SilentlyContinue; if ($pkg) { $localAppData = [Environment]::GetFolderPath(\'LocalApplicationData\'); Write-Output (Join-Path $localAppData \'Packages\' | Join-Path -ChildPath $pkg.PackageFamilyName | Join-Path -ChildPath \'LocalState\' | Join-Path -ChildPath \'settings.json\') }"',
      { maxBuffer: 1024 * 1024 },
    ).toString().trim()

    return stdout || null
  }
  catch (err) {
    console.error('获取 Windows Terminal 设置路径失败:', err)
    return null
  }
}

export function getTerminalProfiles(): string[] {
  const settingsPath = getSettingsPath()
  if (!settingsPath) {
    return []
  }

  try {
    const raw = readFileSync(settingsPath, 'utf-8')
    const json = JSON.parse(raw)
    const list: Array<{ name: string, hidden?: boolean }> = json?.profiles?.list ?? []
    return list
      .filter(p => !p.hidden)
      .map(p => p.name)
      .filter(Boolean)
  }
  catch (err) {
    console.error('读取终端配置文件失败:', err)
    return []
  }
}

export function getTerminalPath(): string | null {
  try {
    const stdout = execSync(
      'powershell -NoProfile -command "$pkg = Get-AppxPackage -Name Microsoft.WindowsTerminal -ErrorAction SilentlyContinue; if ($pkg) { $installDir = $pkg.InstallLocation; Write-Output (Join-Path $installDir \'wt.exe\') }"',
      { maxBuffer: 1024 * 1024 },
    ).toString().trim()

    return stdout || null
  }
  catch (err) {
    console.error('获取 wt.exe 路径失败:', err)
    return null
  }
}
