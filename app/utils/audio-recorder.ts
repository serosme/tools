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

  async stop(): Promise<Blob | null> {
    if (!this.recorder)
      return null

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

    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('读取失败'))
        return
      }

      const base64 = reader.result.split(',')[1]

      if (!base64) {
        reject(new Error('base64 解析失败'))
        return
      }

      resolve(base64)
    }

    reader.onerror = () => reject(new Error('文件读取错误'))
    reader.readAsDataURL(blob)
  })
}
