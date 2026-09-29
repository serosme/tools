import { Buffer } from 'node:buffer'

// 与 electron/asr/recorder.ts 的录音参数对应，两边必须同时改，否则 WAV 头与实际音频不符
const channels = 1
const sampleRate = 16000
const bitsPerSample = 16

export function pcmToWav(pcm: Buffer): Buffer {
  const blockAlign = channels * bitsPerSample / 8
  const wav = Buffer.alloc(44 + pcm.length)

  wav.write('RIFF', 0)
  wav.writeUInt32LE(36 + pcm.length, 4)
  wav.write('WAVE', 8)
  wav.write('fmt ', 12)
  wav.writeUInt32LE(16, 16)
  wav.writeUInt16LE(1, 20)
  wav.writeUInt16LE(channels, 22)
  wav.writeUInt32LE(sampleRate, 24)
  wav.writeUInt32LE(sampleRate * blockAlign, 28)
  wav.writeUInt16LE(blockAlign, 32)
  wav.writeUInt16LE(bitsPerSample, 34)
  wav.write('data', 36)
  wav.writeUInt32LE(pcm.length, 40)
  pcm.copy(wav, 44)

  return wav
}
