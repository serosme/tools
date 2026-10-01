import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { parse } from 'smol-toml'

export interface AppConf {
  asr: { key: string }
  music: { path: string }
  chat: {
    baseUrl: string
    apiKey: string
    defaultModel?: string
    modelKeywords?: string[]
  }
}

const confPath = join(homedir(), '.config', 'tools', 'config.toml')

export function readConf(): AppConf {
  return parse(readFileSync(confPath, 'utf-8')) as unknown as AppConf
}
