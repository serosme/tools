import type { CommandPaletteItem } from '@nuxt/ui'

export default function () {
  const { data } = useSelfFetch<{ name: string }[]>('/api/command/shell', { default: () => [] })
  const items = computed<CommandPaletteItem[]>(() =>
    data.value.map(shell => ({
      label: shell.name,
      icon: 'i-lucide-terminal',
      onSelect: () => selfFetch('/api/command/shell/open', { params: { name: shell.name } }),
    })),
  )
  return { id: 'shell', label: 'Shell', order: 2, items }
}
