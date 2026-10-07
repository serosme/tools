import { homedir } from 'node:os'
import { join } from 'node:path'

const processName = 'mihomo.exe'
const clashDir = join(homedir(), '.config', 'mihomo')
const clashExe = join(clashDir, processName)

export function startClash(tun: boolean): void {
  if (isClashRunning())
    return

  spawnProcess(clashExe, ['-d', clashDir], { elevate: tun })
}

export function stopClash(): void {
  if (!isClashRunning())
    return

  if (spawnProcessSync('taskkill', ['/F', '/IM', processName]).status === 0)
    return

  spawnProcess('taskkill', ['/F', '/IM', processName], { elevate: true })
}

function isClashRunning(): boolean {
  const { stdout } = spawnProcessSync('tasklist', ['/NH', '/FO', 'CSV', '/FI', `IMAGENAME eq ${processName}`])
  return stdout.includes(processName)
}
