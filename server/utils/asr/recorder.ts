import type { Buffer } from 'node:buffer'
import { buffer } from 'node:stream/consumers'
import { Microphone } from 'decibri'

export interface Recording {
  stop: () => Promise<Buffer>
}

export async function record(): Promise<Recording> {
  const microphone = await Microphone.open({
    sampleRate: asrFormat.sampleRate,
    channels: asrFormat.channels,
    framesPerBuffer: asrFormat.framesPerBuffer,
    dtype: asrFormat.dtype,
  })

  const audio = buffer(microphone)

  return {
    async stop() {
      microphone.stop()
      return audio
    },
  }
}
