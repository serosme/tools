import type { Recording } from './recorder.ts'
import { clipboard } from 'electron'
import { recognize } from './client.ts'
import { paste, restoreCapsLock, startHotkey } from './hotkey.ts'
import { record } from './recorder.ts'

let recording: Recording | undefined
let busy = false

export function startAsr(): void {
  startHotkey({
    onDown: () => void start().catch(ignore),
    onUp: () => void stop().catch(ignore),
  })
}

async function start(): Promise<void> {
  if (busy)
    return

  recording = await record()
}

async function stop(): Promise<void> {
  const current = recording
  if (!current || busy)
    return

  restoreCapsLock()
  busy = true
  recording = undefined

  try {
    const audio = await current.stop()
    if (!audio.length)
      return

    clipboard.writeText(await recognize(audio))
    paste()
  }
  finally {
    busy = false
  }
}

function ignore(): void {}
