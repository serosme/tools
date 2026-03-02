export {}

declare global {
  interface Window {
    electronAPI?: {
      getVersion: () => Promise<string>
      showLyricWindow: () => Promise<void>
    }
  }
}
