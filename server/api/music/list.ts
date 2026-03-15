import fs from 'node:fs'

const MUSIC_DIR = 'D:/Music'
const AUDIO_FILE_REGEX = /\.(?:mp3|wav|flac|m4a|wma|ogg|aac|webm)$/i
const FILE_EXTENSION_REGEX = /\.[^.]+$/

export default defineEventHandler(async () => {
  try {
    const files = fs.readdirSync(MUSIC_DIR)
    const audioFiles = files.filter(f => AUDIO_FILE_REGEX.test(f))
    return audioFiles.map((name, index) => ({
      id: index.toString(),
      name: name.replace(FILE_EXTENSION_REGEX, ''),
    }))
  }
  catch {
    return []
  }
})
