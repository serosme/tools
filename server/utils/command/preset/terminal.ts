import { Buffer } from 'node:buffer'

export function openTerminal(command: string, cwd?: string): void {
  // `-w 0` 表示在最近使用的窗口里新开标签页，而不是弹出新窗口
  const args = ['-w', '0']
  if (cwd)
    args.push('-d', cwd)
  args.push('powershell', '-NoExit', '-EncodedCommand', toEncodedCommand(command))

  spawnProcess('wt.exe', args)
}

function toEncodedCommand(command: string): string {
  return Buffer.from(command, 'utf16le').toString('base64')
}
