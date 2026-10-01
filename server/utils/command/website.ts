import type { CommandPaletteItem } from '@nuxt/ui'

const websites: CommandPaletteItem[] = [
  {
    label: 'Chat',
    icon: 'i-lucide-bot',
    path: '/chat',
  },
  {
    label: 'Music',
    icon: 'i-lucide-music',
    path: '/music',
  },
  {
    label: 'Welcome',
    icon: 'i-lucide-house',
    path: '/',
  },
]

export function getWebsites(): CommandPaletteItem[] {
  return websites
}
