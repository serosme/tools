import { Buffer } from 'node:buffer'

export function openTerminal(command: string, cwd?: string): void {
  const args = [
    'powershell',
    '-NoExit',
    '-EncodedCommand',
    toEncodedCommand(command),
  ]
  if (cwd)
    args.unshift('-d', cwd)

  spawnProcess('wt.exe', args)
}

function toEncodedCommand(command: string): string {
  return Buffer.from(command, 'utf16le').toString('base64')
}
