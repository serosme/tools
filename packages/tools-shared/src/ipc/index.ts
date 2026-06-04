import type { PathElectronAPI, PathIPCChannels } from './path.js'
import type { WindowElectronAPI, WindowIPCChannels } from './window.js'

export type IPCChannels = PathIPCChannels & WindowIPCChannels
export type ElectronAPI = PathElectronAPI & WindowElectronAPI
