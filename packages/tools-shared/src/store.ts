import type { AsrConf } from './conf/asr.js'
import type { MihomoConf } from './conf/mihomo.js'
import type { MusicConf } from './conf/music.js'
import os from 'node:os'
import { join } from 'node:path'

export const schema = {
  music: {
    type: 'object',
    default: {
      path: '',
    },
    properties: {
      path: {
        type: 'string',
      },
    },
    required: ['path'],
    additionalProperties: false,
  },
  asr: {
    type: 'object',
    default: {
      key: '',
    },
    properties: {
      key: {
        type: 'string',
      },
    },
    required: ['key'],
    additionalProperties: false,
  },
  mihomo: {
    type: 'object',
    default: {
      path: join(os.homedir(), '.config', 'mihomo'),
    },
    properties: {
      path: {
        type: 'string',
      },
    },
    required: ['path'],
    additionalProperties: false,
  },
} satisfies Record<keyof StoreSchema, unknown>

export interface StoreSchema {
  asr: AsrConf
  mihomo: MihomoConf
  music: MusicConf
}
