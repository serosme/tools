import { fileURLToPath } from 'node:url'
import { APP_URL } from '../server/index.ts'
import { createWindow } from './index.ts'

const preloadPath = fileURLToPath(new URL('../preload.cjs', import.meta.url))

export function createCommandWindow() {
  return createWindow('Command', `${APP_URL}/command`, {
    width: 1280,
    height: 720,
    show: false,
    titleBarStyle: 'hidden',
    skipTaskbar: true,
    webPreferences: {
      preload: preloadPath,
    },
  })
}
