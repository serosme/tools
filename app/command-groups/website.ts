import type { CommandPaletteItem } from '@nuxt/ui'

const origin = window.location.origin

export default function () {
  const { data } = useSelfFetch<CommandPaletteItem[]>('/api/command/website', { default: () => [] })
  const items = computed<CommandPaletteItem[]>(() => data.value.map(toCommandItem))

  return {
    id: 'website',
    label: 'Website',
    order: 1,
    items,
  }
}

function toCommandItem(entry: CommandPaletteItem): CommandPaletteItem {
  return {
    ...entry,
    onSelect: () => window.electronAPI.openWindow({
      name: entry.label!,
      url: new URL(entry.path, origin).href,
    }),
  }
}
