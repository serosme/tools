import { shell } from 'electron'
import { handle } from '../ipc.js'

export function shellIpc() {
  handle('shell:openExternal', (_event, url: string): Promise<boolean> => {
    return shell.openExternal(url).then(() => true)
  })
}
