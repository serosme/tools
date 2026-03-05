export interface WrappedRecognizeBody {
  base64: string
}

export interface RecognizeRequestBody {
  audio: {
    data: string
  }
  request: {
    model_name: string
  }
}

export interface RecognizeResponse {
  audio_info: {
    duration: number
  }
  result: {
    additions: {
      duration: string
    }
    text: string
    utterances: {
      end_time: number
      start_time: number
      text: string
      words: {
        confidence: number
        end_time: number
        start_time: number
        text: string
      }[]
    }[]
  }
}
