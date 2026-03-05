export default defineEventHandler(async (event) => {
  const wrappedReqBody = await readBody<WrappedRecognizeBody>(event)

  const reqBody: RecognizeRequestBody = {
    audio: {
      data: wrappedReqBody.base64,
    },
    request: {
      model_name: 'bigmodel',
    },
  }

  const rsp = await $fetch<RecognizeResponse>('https://openspeech.bytedance.com/api/v3/auc/bigmodel/recognize/flash', {
    method: 'post',
    headers: {
      'x-api-key': '-1',
      'X-Api-Resource-Id': 'volc.bigasr.auc',
      'X-Api-Request-Id': '-1',
      'X-Api-Sequence': '-1',
    },
    body: reqBody,
  })

  return rsp
})
