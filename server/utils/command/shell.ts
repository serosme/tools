import { Buffer } from 'node:buffer'

const shellCommands: Record<string, string> = {
  'Deepseek Harness': 'dsh web',
  'Scoop': 'scoop update; scoop update *; scoop cleanup *',
  'Mise': 'mise upgrade; mise prune',
  'Npm': 'ncu -g',
  'Winget': 'winget update --all',
}

export function getShellNames(): { name: string }[] {
  return Object.keys(shellCommands).map(name => ({ name }))
}

export function getShellCommand(name: string): string {
  return shellCommands[name]!
}

export function openShell(command: string): void {
  spawnProcess('wt.exe', ['powershell', '-NoExit', '-EncodedCommand', toEncodedCommand(command)])
}

function toEncodedCommand(command: string): string {
  return Buffer.from(command, 'utf16le').toString('base64')
}
