import { Buffer } from 'node:buffer'

const mihomoDir = 'C:\\Users\\User\\.config\\mihomo'
const mihomoExe = `${mihomoDir}\\mihomo.exe`

type ShellCommand = () => void

const shellCommands: Record<string, ShellCommand> = {
  'Deepseek Harness': () => openTerminal('dsh web'),
  'Scoop': () => openTerminal('scoop update; scoop update *; scoop cleanup *'),
  'Mise': () => openTerminal('mise upgrade; mise prune'),
  'Npm': () => openTerminal('ncu -g'),
  'Winget': () => openTerminal('winget update --all'),
  'Mihomo 开启': () => startMihomo(false),
  'Mihomo TUN 开启': () => startMihomo(true),
  'Mihomo 关闭': stopMihomo,
}

export function getShellNames(): { name: string }[] {
  return Object.keys(shellCommands).map(name => ({ name }))
}

export function openShell(name: string): void {
  shellCommands[name]?.()
}

function openTerminal(command: string): void {
  spawnProcess('wt.exe', ['powershell', '-NoExit', '-EncodedCommand', toEncodedCommand(command)])
}

function toEncodedCommand(command: string): string {
  return Buffer.from(command, 'utf16le').toString('base64')
}

function startMihomo(tun: boolean): void {
  if (isMihomoRunning())
    return

  spawnProcess(mihomoExe, ['-d', mihomoDir], { elevate: tun })
}

function stopMihomo(): void {
  if (!isMihomoRunning())
    return

  if (spawnProcessSync('taskkill', ['/F', '/IM', 'mihomo.exe']).status === 0)
    return

  spawnProcess('taskkill', ['/F', '/IM', 'mihomo.exe'], { elevate: true })
}

function isMihomoRunning(): boolean {
  const { stdout } = spawnProcessSync('tasklist', ['/NH', '/FO', 'CSV', '/FI', 'IMAGENAME eq mihomo.exe'])
  return stdout.includes('mihomo.exe')
}
