import { APP_URL } from '../server/index.ts'
import { createWindow } from './index.ts'

export function createCommandWindow() {
  return createWindow('Command Palette', `${APP_URL}/command`, {
    width: 1280,
    height: 720,
    show: false,
    titleBarStyle: 'hidden',
    skipTaskbar: true,
  })
}
