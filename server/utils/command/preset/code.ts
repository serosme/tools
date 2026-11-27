import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const codeExe = join(homedir(), 'scoop', 'apps', 'vscode', 'current', 'Code.exe')

export function openCodeFromClipboard(): void {
  const path = readClipboardPath()
  // 剪贴板里是文件夹或文件就用它打开，否则直接开空的 VS Code
  if (existsSync(path))
    spawnProcess(codeExe, [path])
  else
    spawnProcess(codeExe, [])
}
