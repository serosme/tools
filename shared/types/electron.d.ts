export {}

declare global {
  interface Window {
    electronAPI: {
      showLyricWindow: () => Promise<void>
      onToggleRecord: (callback: () => void) => void
      sendRecognizedText: (text: string) => void
      // 获取应用列表
      getApplications: () => Promise<Application[]>
      // 启动应用
      launchApplication: (appId: string) => void
    }
  }
}
