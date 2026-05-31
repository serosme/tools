import type { ElectronAPI } from 'tools-shared'

export const electron = {
  relay: {
    open: () => window.electronAPI.relay.open(),
    send: (text: string) => window.electronAPI.relay.send(text),
  },

  path: {
    folder: {
      select: () => window.electronAPI.path.folder.select(),
    },
  },

  window: {
    create: (path: string) => window.electronAPI.window.create(path),
    close: (id: number) => window.electronAPI.window.close(id),
  },
} satisfies ElectronAPI
