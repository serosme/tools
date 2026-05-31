import { fileURLToPath } from 'node:url'
import { app, BrowserWindow } from 'electron'
import { loadURL, openDevTools } from '../utils/window.js'

let window: BrowserWindow

let isQuitting = false

app.on('before-quit', () => {
  isQuitting = true
})

export function useCommand() {
  const create = async () => {
    window = new BrowserWindow({
      width: 1280,
      height: 720,
      show: false,
      titleBarStyle: 'hidden',
      skipTaskbar: true,
      // transparent: true,
      // frame: false,
      // thickFrame: false,
      webPreferences: {
        preload: fileURLToPath(new URL('../preload.js', import.meta.url)),
        sandbox: false,
      },
    })

    await loadURL(window)
    openDevTools(window)

    // 监听
    window.once('ready-to-show', () => {
      window.show()
    })

    // 监听窗口关闭事件
    // 隐藏窗口
    window.on('close', (event) => {
      if (isQuitting)
        return
      event.preventDefault()
      window?.hide()
    })

    // 监听窗口失焦事件
    // 隐藏窗口
    window.on('blur', () => {
      window.hide()
    })
  }

  const show = () => {
    window.show()
  }

  const hide = () => {
    window.hide()
  }

  const toggle = () => {
    if (window.isVisible()) {
      window.hide()
    }
    else {
      window.show()
    }
  }

  return {
    create,
    show,
    hide,
    toggle,
  }
}
