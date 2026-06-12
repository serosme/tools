import type { AsrConf } from './conf/asr.js'
import type { MihomoConf } from './conf/mihomo.js'
import type { MusicConf } from './conf/music.js'

/** A single form field definition (schema + UI). */
export interface SettingProperty {
  type: string
  label?: string
  description?: string
  component?: 'text' | 'password' | 'path'
}

/** A setting section with UI metadata — used by frontend. */
export interface SettingSection {
  type: 'object'
  label: string
  icon: string
  default: Record<string, unknown>
  properties: Record<string, SettingProperty>
  required: readonly string[]
  additionalProperties: boolean
}

/**
 * Pure JSON Schema — the source of truth for AJV validation.
 * No UI metadata, just data shape.
 */
export const schema = {
  music: {
    type: 'object',
    default: { path: '' },
    properties: {
      path: { type: 'string' },
    },
    required: ['path'],
    additionalProperties: false,
  },
  asr: {
    type: 'object',
    default: { key: '' },
    properties: {
      key: { type: 'string' },
    },
    required: ['key'],
    additionalProperties: false,
  },
  mihomo: {
    type: 'object',
    default: { path: '' },
    properties: {
      path: { type: 'string' },
    },
    required: ['path'],
    additionalProperties: false,
  },
} as const satisfies Record<keyof StoreSchema, unknown>

/**
 * UI-enhanced settings — derived from `schema`.
 * Each section adds label/icon/component for sidebar nav and form rendering.
 */
export const settings = {
  music: {
    ...schema.music,
    label: '音乐',
    icon: 'i-lucide-music',
    properties: {
      path: { ...schema.music.properties.path, label: '音乐库位置', description: '选择音乐库文件夹路径', component: 'path' },
    },
  },
  asr: {
    ...schema.asr,
    label: '语音识别',
    icon: 'i-lucide-mic',
    properties: {
      key: { ...schema.asr.properties.key, label: 'API 密钥', description: '语音识别服务的 API 密钥', component: 'password' },
    },
  },
  mihomo: {
    ...schema.mihomo,
    label: 'Mihomo',
    icon: 'i-lucide-shield',
    properties: {
      path: { ...schema.mihomo.properties.path, label: 'Mihomo 路径', description: '设置 mihomo 的工作目录路径，默认为 ~/.config/mihomo', component: 'path' },
    },
  },
} satisfies Record<string, SettingSection>

export interface StoreSchema {
  asr: AsrConf
  mihomo: MihomoConf
  music: MusicConf
}
