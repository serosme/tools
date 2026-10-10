import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { parse } from 'smol-toml'

export interface AppConf {
  asr: { key: string, hotwords?: Record<string, number> }
  music: { path: string }
  chat: {
    baseUrl: string
    apiKey: string
    defaultModel?: string
    modelKeywords?: string[]
  }
}

const confPath = join(homedir(), '.config', 'tools', 'tools.toml')

// 配置在进程内视为不变，缓存解析结果，避免每个请求同步读盘
let conf: AppConf | undefined

export function readConf(): AppConf {
  if (!conf)
    conf = parse(readFileSync(confPath, 'utf-8')) as unknown as AppConf

  return conf
}
