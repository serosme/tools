import type { CommandPaletteItem } from '@nuxt/ui'
import { pinyin } from 'pinyin-pro'

export default function () {
  const { data } = useSelfFetch<{ name: string }[]>('/api/command/application', { default: () => [] })
  const items = computed<CommandPaletteItem[]>(() =>
    data.value.map(application => ({
      label: application.name,
      icon: 'i-lucide-app-window',
      keywords: [
        pinyin(application.name, { toneType: 'none', separator: '' }),
        pinyin(application.name, { pattern: 'first', toneType: 'none', separator: '' }),
      ],
      onSelect: () => selfFetch('/api/command/application/open', { params: { name: application.name } }),
    })),
  )
  return { id: 'application', label: 'Application', items }
}
