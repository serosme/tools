import { handle } from '../ipc.js'
import { executeJavaScriptForSites, useChat } from '../window/relay.js'

export function relayIpc() {
  handle('relay:open', async (_) => {
    await useChat()
  })
  handle('relay:send', async (_, text: string) => {
    executeJavaScriptForSites(text)
  })
}
