import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  showLyricWindow: () => ipcRenderer.invoke('app:showLyricWindow'),
  onToggleRecord: (callback: () => void) => {
    ipcRenderer.on('toggle-record', callback)
  },
  sendRecognizedText: (text: string) => {
    ipcRenderer.send('app:typeText', text)
  },
})
