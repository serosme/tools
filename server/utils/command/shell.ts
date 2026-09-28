import { Buffer } from 'node:buffer'

const shellCommands: Record<string, string> = {
  'Deepseek Harness': 'dsh web',
  'Update Scoop': 'scoop update; scoop update *; scoop cleanup *',
  'Update Mise': 'mise upgrade; mise prune',
  'Update Npm': 'npm update -g',
  'Update Winget': 'winget update --all',
}

export function getShellNames(): { name: string }[] {
  return Object.keys(shellCommands).map(name => ({ name }))
}

export function getShellCommand(name: string): string {
  return shellCommands[name]!
}

export function openShell(command: string): void {
  openProcess('wt.exe', ['powershell', '-NoExit', '-EncodedCommand', toEncodedCommand(command)])
}

function toEncodedCommand(command: string): string {
  return Buffer.from(command, 'utf16le').toString('base64')
}
