import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { parse } from 'smol-toml'

export interface AppConf {
  asr: {
    key: string
  }
}

const confPath = join(homedir(), '.config', 'tools', 'config.toml')

export const conf = parse(readFileSync(confPath, 'utf-8')) as unknown as AppConf
