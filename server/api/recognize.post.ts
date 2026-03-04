export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const rsp = await $fetch('https://openspeech.bytedance.com/api/v3/auc/bigmodel/recognize/flash', {
    method: 'post',
    headers: {
      'x-api-key': '',
      'X-Api-Resource-Id': 'volc.bigasr.auc',
      'X-Api-Request-Id': '1',
      'X-Api-Sequence': '-1',
    },
    body: {
      audio: {
        data: body.data,
      },
      request: {
        model_name: 'bigmodel',
      },
    },
  })

  return rsp
})
