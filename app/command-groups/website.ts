import type { CommandPaletteItem } from '@nuxt/ui'

const origin = window.location.origin

const websites = [
  { name: 'Welcome', url: `${origin}/`, icon: 'i-lucide-house' },
]

export default function () {
  const items = computed<CommandPaletteItem[]>(() =>
    websites.map(site => ({
      label: site.name,
      icon: site.icon,
      onSelect: () => window.electronAPI.openWindow({
        name: site.name,
        url: site.url,
      }),
    })),
  )
  return { id: 'website', label: 'Website', order: 1, items }
}
