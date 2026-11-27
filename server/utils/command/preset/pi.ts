import { existsSync, mkdirSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const tmpDir = join(homedir(), 'workspace', 'tmp')

export function startPiTemp(): void {
  mkdirSync(tmpDir, { recursive: true })
  openTerminal('pi', tmpDir)
}

export function startPiClipboard(): void {
  const path = readClipboardPath()
  if (!existsSync(path) || !statSync(path).isDirectory())
    return

  openTerminal('pi', path)
}
