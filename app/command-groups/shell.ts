import type { CommandPaletteItem } from '@nuxt/ui'

export default function () {
  const { data } = useSelfFetch<CommandPaletteItem[]>('/api/command/shell', { default: () => [] })
  const items = computed<CommandPaletteItem[]>(() => data.value.map(toCommandItem))
  return { id: 'shell', label: 'Shell', order: 2, items }
}

function toCommandItem(entry: CommandPaletteItem): CommandPaletteItem {
  if (entry.children?.length)
    return { ...entry, children: entry.children.map(toCommandItem) }

  return { ...entry, onSelect: () => selfFetch('/api/command/shell/open', { params: { label: entry.label } }) }
}
