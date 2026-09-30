import type { Buffer } from 'node:buffer'
import { Clipboard } from '@napi-rs/clipboard'

const clipboard = new Clipboard()

let recording: Recording | undefined
let busy = false

export function startAsr(): void {
  startHotkey({
    onDown: () => void begin().catch(ignore),
    onUp: () => void end().catch(ignore),
  })
}

export function stopAsr(): void {
  stopHotkey()
  void recording?.stop()
  recording = undefined
}

export async function transcribe(pcm: Buffer): Promise<string> {
  return requestAsr(pcmToWav(pcm), conf.asr.key)
}

async function begin(): Promise<void> {
  if (busy || recording)
    return

  recording = await record()
}

async function end(): Promise<void> {
  const current = recording
  if (!current || busy)
    return

  recording = undefined
  restoreCapsLock()
  busy = true

  try {
    const audio = await current.stop()
    if (!audio.length)
      return

    clipboard.setText(await transcribe(audio))
    paste()
  }
  finally {
    busy = false
  }
}

function ignore(): void {}
