import type { ElectronAPI } from 'tools-shared'

export const electron = {
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
