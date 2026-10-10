import type { CommandPaletteItem } from '@nuxt/ui'

export default function () {
  const { data } = useSelfFetch<CommandPaletteItem[]>('/api/command/preset', { default: () => [] })
  const items = computed<CommandPaletteItem[]>(() => data.value.map(toCommandItem))

  return {
    id: 'preset',
    label: 'Preset',
    order: 2,
    countItems: true,
    items,
  }
}

function toCommandItem(entry: CommandPaletteItem): CommandPaletteItem {
  if (entry.children?.length) {
    return {
      ...entry,
      children: entry.children.map(toCommandItem),
    }
  }

  return {
    ...entry,
    onSelect: () => selfFetch('/api/command/preset/run', { query: { label: entry.label } }),
  }
}
