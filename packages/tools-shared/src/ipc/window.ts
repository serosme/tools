export interface WindowIPCChannels {
  'window:create': {
    args: [string]
    return: number
  }
  'window:close': {
    args: [number]
    return: boolean
  }
}

export interface WindowElectronAPI {
  window: {
    create: (path: string) => Promise<number>
    close: (id: number) => Promise<boolean>
  }
}
