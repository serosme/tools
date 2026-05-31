export interface RelayIPCChannels {
  'relay:open': {
    args: []
    return: void
  }
  'relay:send': {
    args: [string]
    return: void
  }
}

export interface RelayElectronAPI {
  relay: {
    open: () => Promise<void>
    send: (text: string) => Promise<void>
  }
}
