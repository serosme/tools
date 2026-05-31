import { dialog } from 'electron'
import { handle } from '../ipc.js'

export function pathIpc() {
  handle('path:folder:select', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })

    if (result.canceled) {
      return ''
    }

    return result.filePaths[0]
  })
}
