interface AsrResp {
  result: {
    text: string
  }
}

interface AsrBody {
  base64: string
}

export default defineEventHandler(async (event): Promise<string> => {
  const data = await readBody<AsrBody>(event)

  const response = await $fetch<AsrResp>('https://openspeech.bytedance.com/api/v3/auc/bigmodel/recognize/flash', {
    method: 'POST',
    headers: {
      'x-api-key': conf.get('asr').key,
      'X-Api-Resource-Id': 'volc.bigasr.auc',
      'X-Api-Request-Id': '-1',
      'X-Api-Sequence': '-1',
    },
    body: JSON.stringify({
      audio: {
        data: data.base64,
      },
      request: {
        model_name: 'bigmodel',
        enable_ddc: true,
      },
    }),
  })

  return response.result.text
})
