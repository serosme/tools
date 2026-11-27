export function readClipboard(): string {
  const { stdout } = spawnProcessSync('powershell', [
    '-NoProfile',
    '-NonInteractive',
    '-Command',
    'Get-Clipboard',
  ])
  // Get-Clipboard 会带上行尾换行；资源管理器的「复制为路径」还会带双引号
  return stdout.trim()
}

export function readClipboardPath(): string {
  return readClipboard().replace(/^"|"$/g, '')
}
