let mediaRecorder: MediaRecorder | null = null
let mediaStream: MediaStream | null = null

export async function startRecording() {
  if (mediaRecorder?.state === 'recording')
    return

  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })

  const chunks: BlobPart[] = []
  mediaRecorder = new MediaRecorder(mediaStream)

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data)
    }
  }

  mediaRecorder.start()

  return () => stopRecording(chunks)
}

async function stopRecording(chunks: BlobPart[]) {
  if (!mediaRecorder)
    return null

  const recorder = mediaRecorder

  const blob = await new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: recorder.mimeType }))
    }

    recorder.onerror = () => {
      reject(new Error('Recording failed'))
    }

    recorder.stop()
  })

  cleanup()
  return blob
}

function cleanup() {
  mediaRecorder = null

  mediaStream?.getTracks().forEach(track => track.stop())
  mediaStream = null
}
