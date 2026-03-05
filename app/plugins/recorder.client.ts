export default defineNuxtPlugin(() => {
  const recorder = new AudioRecorder()
  let recording = false

  async function recognize(blob: Blob): Promise<string> {
    const base64 = await blobToBase642(blob)

    const rsp = await $fetch<RecognizeResponse>('/api/recognize', {
      method: 'post',
      body: { base64 },
    })

    return rsp.result.text
  }

  window.electronAPI.onToggleRecord(async () => {
    try {
      if (!recording) {
        await recorder.start()
        recording = true
      }
      else {
        const blob = await recorder.stop()
        recording = false

        const text = await recognize(blob)

        window.electronAPI.sendRecognizedText(text)
      }
    }
    catch (err) {
      console.error(err)
      recording = false
    }
  })
})
