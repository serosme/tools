import type { CommandPaletteItem } from '@nuxt/ui'
import { Buffer } from 'node:buffer'

const presetTree: CommandPaletteItem[] = [
  {
    label: 'Clash',
    icon: 'i-lucide-shield',
    children: [
      {
        label: 'TUN On',
        icon: 'i-lucide-shield',
        action: () => startClash(true),
      },
      {
        label: 'Start',
        icon: 'i-lucide-play',
        action: () => startClash(false),
      },
      {
        label: 'Stop',
        icon: 'i-lucide-square',
        action: stopClash,
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

export function getPresetTree() {
  return presetTree
}

export function runPreset(label: string): void {
  findPresetAction(presetTree, label)?.()
}

function findPresetAction(entries: CommandPaletteItem[], label: string): (() => void) | undefined {
  for (const entry of entries) {
    if (entry.label === label)
      return entry.action as (() => void) | undefined

    const found = entry.children && findPresetAction(entry.children, label)
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
