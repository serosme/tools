export interface ShellIPCChannels {
  'shell:openExternal': {
    args: [string]
    return: boolean
  }
}

export interface ShellElectronAPI {
  shell: {
    openExternal: (url: string) => Promise<boolean>
  }
}
