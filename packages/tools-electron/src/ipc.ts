import type { IPCChannels } from 'tools-shared'
import { ipcMain } from 'electron'

export function handle<K extends keyof IPCChannels>(
  channel: K,
  handler: (
    event: Electron.IpcMainInvokeEvent,
    ...args: IPCChannels[K]['args']
  ) => Promise<IPCChannels[K]['return']> | IPCChannels[K]['return'],
) {
  ipcMain.handle(channel, handler)
}
