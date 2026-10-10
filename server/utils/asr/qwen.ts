import type { Buffer } from 'node:buffer'

const endpoint = 'https://ws-lcd36h8nvhamvqa8.cn-beijing.maas.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'
const model = 'qwen-audio-3.1-asr-flash'

export async function requestAsr(wav: Buffer, asr: AppConf['asr']): Promise<string> {
  const { text } = await $fetch<{ text?: string }>(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${asr.key}`,
      'Content-Type': 'application/json',
    },
    body: {
      model,
      input: {
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'input_audio',
                input_audio: {
                  data: `data:audio/wav;base64,${wav.toString('base64')}`,
                },
              },
            ],
          },
        ],
      },
      parameters: {
        format: 'wav',
        vocabulary: asr.hotwords,
      },
    },
    timeout: 20000,
  })

  return text ?? ''
}
