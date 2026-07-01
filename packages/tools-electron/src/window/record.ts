import { fileURLToPath } from 'node:url'
import { BrowserWindow, screen } from 'electron'
import { loadURL } from '../utils/window.js'

const RECORD_W = 200
const RECORD_H = 56
const BOTTOM_OFFSET = 40

let window: BrowserWindow | null = null

export function useRecordWindow() {
  const create = async () => {
    const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize

    window = new BrowserWindow({
      width: RECORD_W,
      height: RECORD_H,
      show: false,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      focusable: false,
      x: Math.round((sw - RECORD_W) / 2),
      y: Math.round(sh - RECORD_H - BOTTOM_OFFSET),
      webPreferences: {
        preload: fileURLToPath(new URL('../preload.js', import.meta.url)),
        sandbox: false,
      },
    })

    await loadURL(window, '/record')

    window.on('close', (event) => {
      event.preventDefault()
      window?.hide()
    })
  }

  const show = () => {
    window?.showInactive()
  }

  const hide = () => {
    window?.hide()
  }

  const sendState = (state: 'start' | 'stop') => {
    window?.webContents.send('asr:state', state)
  }

  return { create, show, hide, sendState }
}
