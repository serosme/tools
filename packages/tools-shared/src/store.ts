import type { AsrConf } from './conf/asr.js'
import type { MusicConf } from './conf/music.js'

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
} satisfies Record<keyof StoreSchema, unknown>

export interface StoreSchema {
  asr: AsrConf
  music: MusicConf
}
