import type { PathElectronAPI, PathIPCChannels } from './path.js'
import type { RelayElectronAPI, RelayIPCChannels } from './relay.js'
import type { WindowElectronAPI, WindowIPCChannels } from './window.js'

export type IPCChannels = PathIPCChannels & WindowIPCChannels & RelayIPCChannels
export type ElectronAPI = RelayElectronAPI & PathElectronAPI & WindowElectronAPI
