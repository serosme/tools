import type { ElectronAPI } from 'tools-shared'

export {}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
