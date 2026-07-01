import type { ElectronAPI, IPCChannels } from 'tools-shared'
import { contextBridge, ipcRenderer } from 'electron'

export function invoke<K extends keyof IPCChannels>(
  channel: K,
  ...args: IPCChannels[K]['args']
): Promise<IPCChannels[K]['return']> {
  return ipcRenderer.invoke(channel, ...args)
}

const electronAPI: ElectronAPI = {
  path: {
    folder: {
      select: () => invoke('path:folder:select'),
    },
  },

  shell: {
    openExternal: (url: string) => invoke('shell:openExternal', url),
  },

  window: {
    create: (path: string) => invoke('window:create', path),
    close: (id: number) => invoke('window:close', id),
  },

  asr: {
    onCommand: (callback: (_cmd: 'start' | 'stop') => void) => {
      const handler = (_event: Electron.IpcRendererEvent, cmd: 'start' | 'stop') => callback(cmd)
      ipcRenderer.on('asr:state', handler)
      return () => {
        ipcRenderer.removeListener('asr:state', handler)
      }
    },
    sendResult: (text: string) => invoke('asr:result', text),
    hide: () => invoke('asr:hide'),
  },
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
