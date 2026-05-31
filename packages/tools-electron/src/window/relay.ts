import type { RelayConf } from 'tools-shared'
import { fileURLToPath } from 'node:url'
import { BrowserWindow, net, session, WebContentsView } from 'electron'

// ============ 常量配置 ============
const PROXY_RULES = 'http=127.0.0.1:7890;https=127.0.0.1:7890'
const BOTTOM_HEIGHT = 80
const CONFIG_URL = 'http://localhost:3000/api/conf/relay'
const BOTTOM_URL = 'http://localhost:3000/chat'

// ============ 状态管理 ============
const chatViews = new Map<string, WebContentsView>()
let relayConf: RelayConf[] = []

// ============ 工具函数 ============
const getPartition = (name: string) => `persist:${name}`

// 创建 WebContentsView
function createView(name: string, url: string, win?: BrowserWindow) {
  const view = new WebContentsView({
    webPreferences: {
      partition: getPartition(name),
      preload: fileURLToPath(new URL('../preload.js', import.meta.url)),
      sandbox: false,
      contextIsolation: true,
    },
  })

  view.webContents.loadURL(url)
  win?.contentView.addChildView(view)
  return view
}

// ============ 代理配置 ============
async function applyProxies(sites: RelayConf[]) {
  await Promise.allSettled(
    sites.map(({ name }) =>
      session.fromPartition(getPartition(name)).setProxy({ proxyRules: PROXY_RULES }),
    ),
  )
}

// ============ 配置获取 ============
async function fetchRelayConf(): Promise<RelayConf[]> {
  try {
    const res = await net.fetch(CONFIG_URL)
    return res.ok ? (await res.json() as RelayConf[]) : []
  }
  catch {
    return []
  }
}

// ============ 布局管理 ============
function bindLayout(win: BrowserWindow, views: WebContentsView[], bottomView: WebContentsView) {
  const updateLayout = () => {
    const { width, height } = win.getBounds()
    const mainHeight = height - BOTTOM_HEIGHT
    const viewWidth = width / views.length

    views.forEach((view, i) => {
      view.setBounds({
        x: Math.round(i * viewWidth),
        y: 0,
        width: Math.round(viewWidth),
        height: mainHeight,
      })
    })

    bottomView.setBounds({ x: 0, y: mainHeight, width, height: BOTTOM_HEIGHT })
  }

  win.on('resize', updateLayout)
  updateLayout()
}

// ============ 清理函数 ============
function bindCleanup(win: BrowserWindow, views: WebContentsView[]) {
  win.on('closed', () => {
    views.forEach(view => view.webContents.close())
    chatViews.clear()
  })
}

// ============ 脚本注入 ============
export async function executeJavaScriptForSites(text: string) {
  if (!text)
    return

  await Promise.allSettled(
    relayConf
      .map(site => [site, chatViews.get(site.name)] as const)
      .filter(([, view]) => view)
      .map(([site, view]) => {
        const script = site.send.replace(/\{\{TEXT_JSON\}\}/g, JSON.stringify(text))
        return view!.webContents.executeJavaScript(script)
      }),
  )
}

// ============ 主入口 ============
export async function useChat() {
  relayConf = await fetchRelayConf()
  if (!relayConf.length)
    return

  await applyProxies(relayConf)

  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#FFFFFF', symbolColor: '#000000' },
    show: false,
  })

  // 创建底部聊天栏
  const bottomView = createView('bottom', BOTTOM_URL, win)

  // 创建各站点视图
  const views = relayConf.map((site) => {
    const view = createView(site.name, site.url, win)
    chatViews.set(site.name, view)
    return view
  })

  bindLayout(win, views, bottomView)
  bindCleanup(win, [...views, bottomView])
  win.show()
}
