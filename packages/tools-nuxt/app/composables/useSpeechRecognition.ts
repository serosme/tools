import { useBase64, useUserMedia } from '@vueuse/core'

export function useSpeechRecognition() {
  const { stream, start: startStream, stop: stopStream } = useUserMedia({
    constraints: { audio: true },
  })

  const isListening = ref(false)
  const result = ref('')
  const blob = ref<Blob>()
  const { base64 } = useBase64(blob, { dataUrl: false })

  let recorder: MediaRecorder
  let chunks: Blob[] = []

  watch(stream, (s) => {
    if (!s)
      return
    recorder = new MediaRecorder(s)

    recorder.ondataavailable = ({ data }) => data.size && chunks.push(data)

    recorder.onstop = () => {
      blob.value = new Blob(chunks, { type: 'audio/webm' })
      chunks = []
    }

    recorder.start()
    isListening.value = true
  })

  watch(base64, async (b) => {
    if (b) {
      result.value = await $fetch<string>('/api/asr', {
        method: 'post',
        body: {
          base64: b,
        },
      })
    }
  })

  const start = async () => {
    if (isListening.value)
      return

    await startStream()
  }

  const stop = () => {
    if (recorder && recorder.state !== 'inactive')
      recorder.stop()

    stopStream()

    isListening.value = false
  }

  return {
    isListening,
    start,
    stop,
    result,
  }
}
