import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { app, BrowserWindow, Menu } from 'electron'

let mainWindow: BrowserWindow

// 移除默认菜单栏
Menu.setApplicationMenu(null)

export function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: fileURLToPath(new URL('../preload.ts', import.meta.url)),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(app.getAppPath(), '.output', 'public', 'index.html'))
  }
  else {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  }

  // 监听窗口关闭事件，隐藏窗口而不是退出应用
  mainWindow.on('close', (event: Electron.Event) => {
    event.preventDefault()
    mainWindow?.hide()
  })
}

export function showMainWindow() {
  if (!mainWindow) {
    createMainWindow()
    return
  }

  if (mainWindow.isMinimized())
    mainWindow.restore()

  mainWindow.show()
  mainWindow.focus()
}

export function removeCloseListener() {
  mainWindow?.removeAllListeners('close')
}

export function toggleRecord() {
  mainWindow.webContents.send('app:toggleRecord')
}
