import { spawn } from 'node:child_process'

export function openProcess(command: string, args: string[]): void {
  spawn(command, args, { detached: true, stdio: 'ignore' }).unref()
}
