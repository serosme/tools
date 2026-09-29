import type { ForgeConfig } from '@electron-forge/shared-types'

const config: ForgeConfig = {
  rebuildConfig: {
    ignoreModules: ['uiohook-napi'],
  },

  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
      config: {},
    },
  ],
}

export default config
