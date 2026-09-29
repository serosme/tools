import { spawn, spawnSync } from 'node:child_process'
import { homedir } from 'node:os'

const childCwd = homedir()

export function spawnProcess(command: string, args: string[], options: { elevate?: boolean } = {}) {
  if (options.elevate)
    spawnElevated(command, args)
  else
    spawnDirect(command, args)
}

function spawnDirect(command: string, args: string[]) {
  spawn(command, args, { detached: true, stdio: 'ignore', cwd: childCwd }).unref()
}

function spawnElevated(command: string, args: string[]) {
  const psArgumentList = args.length ? ` -ArgumentList ${args.map(arg => `'${arg}'`).join(',')}` : ''
  const psCommand = `Start-Process -FilePath '${command}'${psArgumentList} -Verb RunAs -WindowStyle Hidden`
  spawn('powershell', ['-NoProfile', '-NonInteractive', '-Command', psCommand], {
    stdio: 'ignore',
    windowsHide: true,
    cwd: childCwd,
  }).unref()
}

export function spawnProcessSync(command: string, args: string[]) {
  const result = spawnSync(command, args, { encoding: 'buffer', windowsHide: true, cwd: childCwd })
  return {
    status: result.status,
    stdout: decodeOutput(result.stdout),
    stderr: decodeOutput(result.stderr),
    error: result.error,
  }
}

function decodeOutput(bytes: Uint8Array | null | undefined): string {
  if (!bytes?.length)
    return ''
  const text = new TextDecoder('utf-8').decode(bytes)
  return text.includes('\uFFFD') ? new TextDecoder('gbk').decode(bytes) : text
}
