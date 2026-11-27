import { existsSync, mkdirSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const tmpDir = join(homedir(), 'workspace', 'tmp')

export function startPi(): void {
  const path = readClipboardPath()
  // 只有剪贴板里是目录才用它当工作目录，是文件或不是有效路径都退回临时目录
  if (existsSync(path) && statSync(path).isDirectory()) {
    openTerminal('pi', path)
    return
  }

  mkdirSync(tmpDir, { recursive: true })
  openTerminal('pi', tmpDir)
}
