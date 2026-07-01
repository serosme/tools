import type { ElectronAPI } from 'tools-shared'

export const electron = {
  path: {
    folder: {
      select: () => window.electronAPI.path.folder.select(),
    },
  },

  shell: {
    openExternal: (url: string) => window.electronAPI.shell.openExternal(url),
  },

  window: {
    create: (path: string) => window.electronAPI.window.create(path),
    close: (id: number) => window.electronAPI.window.close(id),
  },

  asr: {
    onCommand: (callback: (_cmd: 'start' | 'stop') => void) =>
      window.electronAPI.asr.onCommand(callback),
    sendResult: (text: string) => window.electronAPI.asr.sendResult(text),
    hide: () => window.electronAPI.asr.hide(),
  },
} satisfies ElectronAPI
