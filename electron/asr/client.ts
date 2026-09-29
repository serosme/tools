import type { Buffer } from 'node:buffer'
import { APP_URL } from '../server/index.ts'

export async function recognize(audio: Buffer): Promise<string> {
  const response = await fetch(`${APP_URL}/api/asr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: audio,
  })

  if (!response.ok)
    throw new Error(await response.text())

  const result = await response.json() as { text: string }
  return result.text
}
