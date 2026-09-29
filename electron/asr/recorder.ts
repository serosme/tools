import type { Buffer } from 'node:buffer'
import { buffer } from 'node:stream/consumers'
import { Microphone } from 'decibri'

export interface Recording {
  stop: () => Promise<Buffer>
}

// 与 server/utils/asr/wav.ts 的 WAV 头参数对应，两边必须同时改，否则 WAV 头与实际音频不符
const sampleRate = 16000
const channels = 1

export async function record(): Promise<Recording> {
  const microphone = await Microphone.open({
    sampleRate,
    channels,
    framesPerBuffer: 1600,
    dtype: 'int16',
  })

  const audio = buffer(microphone)

  return {
    async stop() {
      microphone.stop()
      return audio
    },
  }
}
