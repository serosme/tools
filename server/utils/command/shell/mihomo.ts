const mihomoDir = 'C:\\Users\\User\\.config\\mihomo'
const mihomoExe = `${mihomoDir}\\mihomo.exe`

export function startMihomo(tun: boolean): void {
  if (isMihomoRunning())
    return

  spawnProcess(mihomoExe, ['-d', mihomoDir], { elevate: tun })
}

export function stopMihomo(): void {
  if (!isMihomoRunning())
    return

  if (spawnProcessSync('taskkill', ['/F', '/IM', 'mihomo.exe']).status === 0)
    return

  spawnProcess('taskkill', ['/F', '/IM', 'mihomo.exe'], { elevate: true })
}

function isMihomoRunning(): boolean {
  const { stdout } = spawnProcessSync('tasklist', ['/NH', '/FO', 'CSV', '/FI', 'IMAGENAME eq mihomo.exe'])
  return stdout.includes('mihomo.exe')
}
