import type { CommandPaletteItem } from '@nuxt/ui'
import { Buffer } from 'node:buffer'

const shellTree: CommandPaletteItem[] = [
  {
    label: 'Deepseek Harness',
    icon: 'i-lucide-atom',
    action: () => openTerminal('dsh web'),
  },
  {
    label: 'Mihomo',
    icon: 'i-lucide-shield',
    children: [
      {
        label: 'TUN 开启',
        icon: 'i-lucide-shield',
        action: () => startMihomo(true),
      },
      {
        label: '开启',
        icon: 'i-lucide-play',
        action: () => startMihomo(false),
      },
      {
        label: '关闭',
        icon: 'i-lucide-square',
        action: stopMihomo,
      },
    ],
  },
  {
    label: 'Update',
    icon: 'i-lucide-arrow-up',
    children: [
      {
        label: 'Scoop',
        icon: 'i-lucide-app-window',
        action: () => openTerminal('scoop update; scoop update *; scoop cleanup *'),
      },
      {
        label: 'Mise',
        icon: 'i-lucide-code',
        action: () => openTerminal('mise upgrade; mise prune'),
      },
      {
        label: 'Npm',
        icon: 'i-lucide-package',
        action: () => openTerminal('ncu -g'),
      },
      {
        label: 'Winget',
        icon: 'i-lucide-monitor',
        action: () => openTerminal('winget update --all'),
      },
    ],
  },
]

export function getShellTree() {
  return shellTree
}

export function openShell(label: string): void {
  findShellAction(shellTree, label)?.()
}

function findShellAction(entries: CommandPaletteItem[], label: string): (() => void) | undefined {
  for (const entry of entries) {
    if (entry.label === label)
      return entry.action as (() => void) | undefined

    const found = entry.children && findShellAction(entry.children, label)
    if (found)
      return found
  }
}

function openTerminal(command: string): void {
  spawnProcess('wt.exe', ['powershell', '-NoExit', '-EncodedCommand', toEncodedCommand(command)])
}

function toEncodedCommand(command: string): string {
  return Buffer.from(command, 'utf16le').toString('base64')
}
