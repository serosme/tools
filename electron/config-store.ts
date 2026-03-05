import { Buffer } from 'node:buffer'
import { safeStorage } from 'electron'
import Store from 'electron-store'

const store = new Store()

export function setConfig(key: string, value: string, encrypt = false): void {
  if (encrypt) {
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('Encryption not available')
    }
    const encrypted = safeStorage.encryptString(value).toString('base64')
    store.set(key, encrypted)
  }
  else {
    store.set(key, value)
  }
}

export function getConfig(key: string, encrypt = false): string | null {
  const stored = store.get(key) as string | undefined
  if (!stored)
    return null

  if (encrypt) {
    const buffer = Buffer.from(stored, 'base64')
    return safeStorage.decryptString(buffer)
  }
  else {
    return stored
  }
}

export function deleteConfig(key: string): void {
  store.delete(key)
}

export function hasConfig(key: string): boolean {
  return store.has(key)
}
