export interface PathIPCChannels {
  'path:folder:select': {
    args: []
    return: string
  }
}

export interface PathElectronAPI {
  path: {
    folder: {
      select: () => Promise<string>
    }
  }
}
