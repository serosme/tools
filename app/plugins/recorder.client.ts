export default defineNuxtPlugin(() => {
  const recorder = new AudioRecorder()
  let isRecording = false

  async function recognize(blob: Blob): Promise<string> {
    const base64 = await blobToBase64(blob)

    const rsp = await $fetch('/api/recognize', {
      method: 'post',
      body: { data: base64 },
    })

    return rsp.result.text
  }

  window.electronAPI.onToggleRecord(async () => {
    try {
      if (!isRecording) {
        await recorder.start()
        isRecording = true
      }
      else {
        const blob = await recorder.stop()
        isRecording = false

        const text = await recognize(blob)

        window.electronAPI.sendRecognizedText(text)
      }
    }
    catch (err) {
      console.error(err)
      isRecording = false
    }
  })
})
