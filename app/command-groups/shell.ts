import type { CommandPaletteItem } from '@nuxt/ui'

const commands = [
  { label: 'Deepseek Harness', icon: 'i-lucide-sparkles', command: 'dsh web' },
  { label: 'Update Scoop', icon: 'i-lucide-app-window', command: 'scoop update; scoop update *; scoop cleanup *' },
  { label: 'Update Mise', icon: 'i-lucide-code', command: 'mise upgrade; mise prune' },
  { label: 'Update Npm', icon: 'i-lucide-package', command: 'npm update -g' },
  { label: 'Update Winget', icon: 'i-lucide-monitor', command: 'winget update --all' },
]

export default function () {
  const items = computed<CommandPaletteItem[]>(() =>
    commands.map(({ label, icon, command }) => ({
      label,
      icon,
      onSelect: () => selfFetch('/api/command/shell/open', { params: { command } }),
    })),
  )
  return { id: 'shell', label: 'Shell', order: 1, items }
}
