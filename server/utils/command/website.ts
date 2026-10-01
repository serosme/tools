import type { CommandPaletteItem } from '@nuxt/ui'

const websites: CommandPaletteItem[] = [
  {
    label: 'Chat',
    icon: 'i-lucide-message-square-text',
    path: '/chat',
  },
  {
    label: 'Music',
    icon: 'i-lucide-music-2',
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
