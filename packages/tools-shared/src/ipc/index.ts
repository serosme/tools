import type { PathElectronAPI, PathIPCChannels } from './path.js'
import type { ShellElectronAPI, ShellIPCChannels } from './shell.js'
import type { WindowElectronAPI, WindowIPCChannels } from './window.js'

export type IPCChannels = PathIPCChannels & ShellIPCChannels & WindowIPCChannels
export type ElectronAPI = PathElectronAPI & ShellElectronAPI & WindowElectronAPI
