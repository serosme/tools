import { useBase64, useUserMedia } from '@vueuse/core'

export function useSpeechRecognition() {
  const { stream, start: startStream, stop: stopStream } = useUserMedia({
    constraints: { audio: true },
  })

  const result = ref('')
  const finished = ref(0)
  const blob = ref<Blob>()
  const { base64 } = useBase64(blob, { dataUrl: false })

  let recorder: MediaRecorder
  let chunks: Blob[] = []
  let listening = false

  watch(stream, (s) => {
    if (!s)
      return
    recorder = new MediaRecorder(s)
    recorder.ondataavailable = ({ data }) => data.size && chunks.push(data)
    recorder.start()
    listening = true
  })

  const start = async () => {
    if (listening)
      return
    await startStream()
  }

  const stop = () => {
    const hasRecorder = recorder && recorder.state !== 'inactive'

    if (hasRecorder) {
      recorder.onstop = () => {
        blob.value = new Blob(chunks, { type: 'audio/webm' })
        chunks = []
        if (blob.value.size === 0) {
          result.value = ''
          finished.value++
        }
      }
      recorder.stop()
    }
    else {
      result.value = ''
      finished.value++
    }

    stopStream()
    listening = false
  }

  watch(base64, async (b) => {
    if (b) {
      result.value = await $fetch<string>('/api/asr', {
        method: 'post',
        body: { base64: b },
      })
      finished.value++
    }
  })

  return { finished, start, stop, result }
}
