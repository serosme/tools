import { handle } from '../ipc.js'
import { closeWindow, createWindow } from '../window/home.js'

export function windowIpc() {
  handle('window:create', (_, path: string) => createWindow(path))
  handle('window:close', (_, id: number) => closeWindow(id))
}
