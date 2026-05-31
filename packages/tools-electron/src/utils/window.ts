import type { BrowserWindow } from 'electron'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { app } from 'electron'

async function waitForServer(url: string, timeout = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      if ((await fetch(url, { method: 'HEAD' })).status < 500)
        return
    }
    catch {}
    await new Promise(r => setTimeout(r, 300))
  }
  throw new Error(`Server not ready: ${url}`)
}

export function startRendererProcess() {
  if (process.env.NODE_ENV !== 'dev') {
    import(pathToFileURL(path.join(app.getAppPath(), '../tools-nuxt/.output/server/index.mjs')).href)
  }
}

export async function loadURL(window: BrowserWindow) {
  await waitForServer('http://localhost:3000')
  window.loadURL('http://localhost:3000')
}

export function openDevTools(window: BrowserWindow) {
  if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'preview') {
    window.webContents.openDevTools()
  }
}
