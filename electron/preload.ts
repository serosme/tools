import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  showLyricWindow: () => ipcRenderer.invoke('app:showLyricWindow'),
})
