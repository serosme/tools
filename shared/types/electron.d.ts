export {}

declare global {
  interface Window {
    electronAPI: {
      showLyricWindow: () => Promise<void>
      onToggleRecord: (callback: () => void) => void
      sendRecognizedText: (text: string) => void
    }
  }
}
