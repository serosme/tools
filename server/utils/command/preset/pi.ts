import { existsSync, mkdirSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const tmpDir = join(homedir(), 'workspace', 'tmp')

export function startPiTemp(): void {
  mkdirSync(tmpDir, { recursive: true })
  openTerminal('pi', tmpDir)
}

export function startPiClipboard(): void {
  const path = readClipboard().replace(/^"|"$/g, '')
  if (!existsSync(path) || !statSync(path).isDirectory())
    return

  openTerminal('pi', path)
}

function readClipboard(): string {
  const { stdout } = spawnProcessSync('powershell', [
    '-NoProfile',
    '-NonInteractive',
    '-Command',
    'Get-Clipboard',
  ])
  // Get-Clipboard 会带上行尾换行；资源管理器的「复制为路径」还会带双引号
  return stdout.trim()
}
