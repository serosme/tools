import { mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const tmpDir = join(homedir(), 'workspace', 'tmp')

export function startPiTemp(): void {
  mkdirSync(tmpDir, { recursive: true })
  openTerminal('pi', tmpDir)
}
