import process from 'node:process'
import { app } from 'electron'

// 渲染服务地址
export const APP_PORT = 2080
export const APP_URL = `http://localhost:${APP_PORT}`

// 轮询等待渲染服务
async function waitForServer() {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    try {
      await fetch(APP_URL)
      return
    }
    catch {}
    await new Promise(r => setTimeout(r, 200))
  }
}

// 启动渲染服务
export async function startServer() {
  if (app.isPackaged) {
    // Nitro 的内置 server 只认 NITRO_PORT
    process.env.NITRO_PORT = String(APP_PORT)

    // @ts-expect-error .output 是构建产物，没有类型声明
    await import('../../.output/server/index.mjs')
  }

  await waitForServer()
}
