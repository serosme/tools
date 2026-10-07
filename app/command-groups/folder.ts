import type { CommandPaletteItem } from '@nuxt/ui'

export default function () {
  const { data } = useSelfFetch('/api/command/folder', { default: () => [] })
  const items = computed<CommandPaletteItem[]>(() =>
    data.value.map(folder => ({
      label: folder.name,
      icon: 'i-lucide-folder',
      onSelect: () => selfFetch('/api/command/folder/open', { query: { name: folder.name } }),
    })),
  )
  return { id: 'folder', label: 'Folder', items }
}
