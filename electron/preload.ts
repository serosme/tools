import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  showLyricWindow: () => ipcRenderer.invoke('app:showLyricWindow'),
  onToggleRecord: (callback: () => void) => {
    ipcRenderer.on('app:toggleRecord', callback)
  },
  sendRecognizedText: (text: string) => {
    ipcRenderer.send('app:typeText', text)
  },

  // 获取应用列表
  getApplications: () => ipcRenderer.invoke('app:getApplications'),

  // 启动应用
  launchApplication: (appId: string) => {
    ipcRenderer.send('app:launchApplication', appId)
  },
})
