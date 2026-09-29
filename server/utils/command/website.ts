import type { CommandPaletteItem } from '@nuxt/ui'

const websites: CommandPaletteItem[] = [
  {
    label: 'Welcome',
    icon: 'i-lucide-house',
    path: '/',
  },
]

export function getWebsites(): CommandPaletteItem[] {
  return websites
}
