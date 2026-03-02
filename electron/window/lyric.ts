import path from 'node:path'
import { app, BrowserWindow } from 'electron'

let lyricWindow: BrowserWindow | null

function createLyricWindow() {
  lyricWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    transparent: true,
    skipTaskbar: true,
    alwaysOnTop: true,
    focusable: false,
  })

  lyricWindow.setIgnoreMouseEvents(true)

  if (app.isPackaged) {
    lyricWindow.loadFile(path.join(app.getAppPath(), '.output', 'public', 'index.html'))
  }
  else {
    lyricWindow.loadURL('http://localhost:3000/#/lyric')
  }
}

export function showLyricWindow() {
  if (!lyricWindow) {
    createLyricWindow()
    return
  }

  if (lyricWindow.isMinimized())
    lyricWindow.restore()

  lyricWindow.show()
  lyricWindow.focus()
}

export function removeLyricWindow() {
  if (lyricWindow) {
    lyricWindow.close()
    lyricWindow = null
  }
}
