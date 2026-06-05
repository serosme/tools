import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import conf from './conf.js'

function getMihomoDir(): string {
  return conf.get('mihomo').path
}

function getExePath(): string {
  return join(getMihomoDir(), 'mihomo.exe')
}

function getPidFile(): string {
  return join(getMihomoDir(), 'mihomo.pid')
}

async function ensureDir() {
  await mkdir(getMihomoDir(), { recursive: true })
}

function runElevatedPowerShell(script: string) {
  return spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', script], {
    timeout: 15_000,
    windowsHide: true,
    encoding: 'utf-8',
  })
}

export async function startMihomo(admin = false) {
  const existingPid = await readPid()
  if (existingPid) {
    return { success: false, message: 'Already running' }
  }

  await ensureDir()

  if (admin) {
    return startMihomoAsAdmin()
  }

  const child = spawn(getExePath(), [], {
    detached: true,
    stdio: 'ignore',
    cwd: getMihomoDir(),
  })

  child.unref()

  await writePid(child.pid!)

  return { success: true, pid: child.pid }
}

async function startMihomoAsAdmin() {
  const esc = (s: string) => s.replace(/'/g, '\'\'')

  const result = runElevatedPowerShell([
    `$psi = New-Object System.Diagnostics.ProcessStartInfo`,
    `$psi.FileName = '${esc(getExePath())}'`,
    `$psi.Arguments = ''`,
    `$psi.Verb = 'runas'`,
    `$psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden`,
    `$psi.WorkingDirectory = '${esc(getMihomoDir())}'`,
    `$psi.UseShellExecute = $true`,
    `$p = [System.Diagnostics.Process]::Start($psi)`,
    `$p.Id | Out-File -FilePath '${esc(getPidFile())}' -Encoding utf8`,
  ].join('; '))

  if (result.error) {
    return { success: false, message: `提权启动失败: ${result.error.message}` }
  }

  await new Promise(resolve => setTimeout(resolve, 1500))

  const pid = await readPid()
  if (pid) {
    return { success: true, pid }
  }

  return { success: false, message: '启动失败：未检测到 mihomo 进程，可能用户取消了 UAC 授权' }
}

export async function stopMihomo() {
  const pid = await readPid()
  if (!pid) {
    return { success: false, message: 'Not running' }
  }

  let killed = false

  try {
    process.kill(pid)
    killed = true
  }
  catch {
    // EPERM → 提权后进程，继续下一步
  }

  if (!killed) {
    const result = runElevatedPowerShell(
      `Start-Process -FilePath "taskkill" -ArgumentList '/F','/PID','${pid}' -Verb RunAs -WindowStyle Hidden -Wait`,
    )
    killed = result.status === 0
  }

  if (!killed) {
    return { success: false, message: '停止失败：进程仍在运行，可能取消了 UAC 授权' }
  }

  await removePid()
  return { success: true }
}

export async function getMihomoStatus() {
  const pid = await readPid()
  return { running: pid !== null, pid }
}

async function readPid(): Promise<number | null> {
  try {
    const pidStr = (await readFile(getPidFile(), 'utf-8')).trim()
    const pid = Number(pidStr)
    if (!Number.isInteger(pid) || pid <= 0) {
      return null
    }

    try {
      process.kill(pid, 0)
    }
    catch (err: any) {
      if (err.code === 'EPERM') {
        return pid
      }
      return null
    }
    return pid
  }
  catch {
    return null
  }
}

async function writePid(pid: number) {
  await writeFile(getPidFile(), String(pid), 'utf-8')
}

async function removePid() {
  if (existsSync(getPidFile())) {
    await unlink(getPidFile())
  }
}

export function available() {
  return { available: existsSync(getExePath()) }
}
