import type { ForgeConfig } from '@electron-forge/shared-types'

const config: ForgeConfig = {
  packagerConfig: {
    prune: false,
    ignore: [
      /^\/node_modules($|\/)/,
      /^\/\.nuxt($|\/)/,
    ],
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
