export class AudioRecorder {
  private recorder: MediaRecorder | null = null
  private stream: MediaStream | null = null
  private chunks: BlobPart[] = []

  async start() {
    if (this.recorder?.state === 'recording')
      return

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    this.recorder = new MediaRecorder(this.stream)

    this.chunks = []

    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0)
        this.chunks.push(e.data)
    }

    this.recorder.start()
  }

  async stop(): Promise<Blob> {
    if (!this.recorder)
      return new Blob()

    const blob = await new Promise<Blob>((resolve, reject) => {
      this.recorder!.onstop = () => {
        resolve(new Blob(this.chunks, { type: this.recorder!.mimeType }))
      }

      this.recorder!.onerror = () => reject(new Error('Recording failed'))
      this.recorder!.stop()
    })

    this.cleanup()
    return blob
  }

  private cleanup() {
    this.stream?.getTracks().forEach(t => t.stop())
    this.stream = null
    this.recorder = null
    this.chunks = []
  }
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('文件读取错误'))

    reader.onloadend = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        return reject(new Error('读取失败'))
      }

      const i = result.indexOf(',')
      if (i === -1) {
        return reject(new Error('base64 解析失败'))
      }

      resolve(result.slice(i + 1))
    }

    reader.readAsDataURL(blob)
  })
}

export async function blobToBase642(blob: Blob) {
  const buffer = await blob.arrayBuffer()
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}
