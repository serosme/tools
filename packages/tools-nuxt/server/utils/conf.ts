import type { StoreSchema } from 'tools-shared'
import os from 'node:os'
import path from 'node:path'
import Conf from 'conf'
import { schema } from 'tools-shared'

const conf = new Conf<StoreSchema>({
  cwd: path.join(os.homedir(), '.config', 'tools'),
  schema,
  defaults: {
    mihomo: { path: path.join(os.homedir(), '.config', 'mihomo') },
  },
})

export default conf
