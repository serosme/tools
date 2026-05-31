import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'

export function useCommand() {
  const router = useRouter()
  const toast = useToast()
  const routeActions: Record<string, () => void> = {
    '/chat': () => electron.relay.open(),
  }
  const pages = computed<CommandPaletteItem[]>(() =>
    router.getRoutes()
      .filter((route) => {
        const path = route.path
        return /^\/[a-z][a-z0-9]*$/i.test(path)
      })
      .map(route => ({
        label: route.path.slice(1).charAt(0).toUpperCase() + route.path.slice(2),
        icon: 'i-lucide-globe',
        onSelect: routeActions[route.path] ?? (() => electron.window.create(route.path)),
      })),
  )

  const folders: CommandPaletteItem[] = [
    {
      label: 'Download',
      icon: 'i-lucide-download',
      onSelect: () => $fetch(`/api/folder/${base64urlEncode('C:\\Users\\User\\Downloads')}`),
    },
    {
      label: 'Document',
      icon: 'i-lucide-folder',
      onSelect: () => $fetch(`/api/folder/${base64urlEncode('C:\\Users\\User\\Documents')}`),
    },
    {
      label: 'AppData',
      icon: 'i-lucide-folder',
      onSelect: () => $fetch(`/api/folder/${base64urlEncode('C:\\Users\\User\\AppData')}`),
    },
    {
      label: 'Rime',
      icon: 'i-lucide-folder',
      onSelect: () => $fetch(`/api/folder/${base64urlEncode('C:\\Users\\User\\AppData\\Roaming\\Rime')}`),
    },
  ]

  const { data: applications } = useFetch('/api/app', {
    default: () => [],
    transform: data => data || [],
    onRequestError: (err) => {
      console.error('请求错误:', err)
    },
    onResponseError: (err) => {
      console.error('响应错误:', err)
    },
  }) as { data: Ref<Application[]> }
  const apps = computed<CommandPaletteItem[]>(() =>
    applications.value.map(app => ({
      label: app.name,
      icon: 'i-lucide-app-window',
      onSelect: () => $fetch(`/api/app/${app.base64url}`),
    })),
  )

  const commands = computed<CommandPaletteItem[]>(() => [
    {
      label: 'mihomo',
      icon: 'i-lucide-toggle-right',
      keywords: ['mihomo', 'normal'],
      onSelect: () => toggleMihomo(false),
    },
    {
      label: 'mihomo-tun',
      icon: 'i-lucide-shield',
      keywords: ['mihomo', 'admin'],
      onSelect: () => toggleMihomo(true),
    },
  ])

  async function toggleMihomo(admin: boolean) {
    const { available } = await $fetch<{ available: boolean }>('/api/mihomo/available')
    if (!available) {
      toast.add({ title: 'Mihomo 未安装', description: '请先下载 mihomo.exe', color: 'warning', duration: 3000 })
      return
    }

    const status = await $fetch<{ running: boolean, pid: number | null }>('/api/mihomo/status')

    if (status.running) {
      try {
        await $fetch('/api/mihomo/stop', { method: 'POST' })
        toast.add({ title: 'Mihomo 已停止', color: 'success', duration: 1200 })
      }
      catch (e: any) {
        toast.add({ title: e?.message || '停止失败', color: 'error', duration: 2000 })
      }
    }
    else {
      try {
        await $fetch('/api/mihomo/start', { method: 'POST', body: { admin } })
        toast.add({ title: `Mihomo 已启动${admin ? '（管理员）' : ''}`, color: 'success', duration: 1200 })
      }
      catch (e: any) {
        toast.add({ title: e?.message || '启动失败', color: 'error', duration: 2000 })
      }
    }
  }

  const groups = computed<CommandPaletteGroup[]>(() => [
    {
      id: 'pages',
      label: 'Pages',
      items: pages.value,
    },
    {
      id: 'commands',
      label: 'Commands',
      items: commands.value,
    },
    {
      id: 'folders',
      label: 'Folders',
      items: folders,
    },
    {
      id: 'applications',
      label: 'Applications',
      items: apps.value,
    },
  ])

  return {
    groups,
    pages,
    commands,
    folders,
    apps,
  }
}
