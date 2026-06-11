import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'

export function useCommand() {
  const searchTerm = ref('')
  const paletteKey = ref(0)
  function resetPalette() {
    searchTerm.value = ''
    nextTick(() => {
      paletteKey.value++
    })
  }
  const router = useRouter()
  const toast = useToast()
  const pages = computed<CommandPaletteItem[]>(() =>
    router.getRoutes()
      .filter((route) => {
        const path = route.path
        return /^\/[a-z][a-z0-9]*$/i.test(path)
      })
      .map(route => ({
        label: route.path.slice(1).charAt(0).toUpperCase() + route.path.slice(2),
        icon: 'i-lucide-globe',
        onSelect: () => electron.window.create(route.path),
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

  const { data: workspaceProjects } = useFetch<WorkspaceProject[]>('/api/workspace', {
    default: () => [],
    transform: data => data || [],
    onRequestError: (err) => {
      console.error('获取工作区项目失败:', err)
      toast.add({ title: '获取工作区项目失败', description: String(err), color: 'error', duration: 3000 })
    },
    onResponseError: (err) => {
      console.error('获取工作区项目响应错误:', err)
      toast.add({ title: '获取工作区项目响应异常', color: 'error', duration: 3000 })
    },
  })
  const projects = computed<CommandPaletteItem[]>(() =>
    workspaceProjects.value.map(project => ({
      label: project.name,
      icon: 'i-lucide-folder',
      children: [
        {
          label: 'Terminal',
          icon: 'i-lucide-terminal',
          onSelect: () => $fetch(`/api/workspace/open?path=${encodeURIComponent(project.path)}&type=terminal`),
        },
        {
          label: 'VSCode',
          icon: 'i-lucide-code',
          onSelect: () => $fetch(`/api/workspace/open?path=${encodeURIComponent(project.path)}&type=vscode`),
        },
        {
          label: 'IDEA',
          icon: 'i-lucide-braces',
          onSelect: () => $fetch(`/api/workspace/open?path=${encodeURIComponent(project.path)}&type=idea`),
        },
      ],
    })),
  )

  const { data: terminalProfiles } = useFetch('/api/terminal', {
    default: () => [],
    transform: data => data || [],
    onRequestError: (err) => {
      console.error('请求终端配置文件失败:', err)
    },
    onResponseError: (err) => {
      console.error('获取终端配置文件响应错误:', err)
    },
  }) as { data: Ref<string[]> }
  const terminals = computed<CommandPaletteItem[]>(() =>
    terminalProfiles.value.map(name => ({
      label: name,
      icon: 'i-lucide-terminal',
      onSelect: () => $fetch(`/api/terminal/open?name=${encodeURIComponent(name)}`),
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

  const quicks = computed<CommandPaletteItem[]>(() => {
    const term = searchTerm.value.trim()
    if (!term)
      return []

    const chars = [...term].length

    return [
      {
        label: 'Google 搜索',
        suffix: term,
        icon: 'i-lucide-search',
        onSelect: () => {
          electron.shell.openExternal(`https://www.google.com/search?q=${encodeURIComponent(term)}`)
        },
      },
      {
        label: '统计字符',
        suffix: `${chars} 字符`,
        icon: 'i-lucide-text',
        onSelect: () => { },
      },
    ]
  })

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
      id: 'terminals',
      label: 'Terminals',
      items: terminals.value,
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
    {
      id: 'workspace',
      label: 'Workspace',
      items: projects.value,
    },
    {
      id: 'quicks',
      label: 'Quicks',
      items: quicks.value,
      ignoreFilter: true,
    },
  ])

  return {
    searchTerm,
    paletteKey,
    resetPalette,
    groups,
    pages,
    commands,
  }
}
