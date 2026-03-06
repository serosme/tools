import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { ipcMain, shell } from 'electron'

interface Shortcut {
  name: string
  path: string
}

function findShortcuts(dir: string): Shortcut[] {
  const shortcuts: Shortcut[] = []

  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)

    if (item.isDirectory()) {
      // 递归子文件夹
      shortcuts.push(...findShortcuts(fullPath))
    }
    else if (item.name.endsWith('.lnk')) {
      // 添加快捷方式，去掉.lnk扩展名
      shortcuts.push({
        name: item.name.replace(/\.lnk$/, ''),
        path: fullPath,
      })
    }
  }

  return shortcuts
}

export function getStartMenuShortcuts(): Shortcut[] {
  const shortcuts: Shortcut[] = []

  // Windows开始菜单路径
  const startMenuPaths = [
    path.join(process.env.APPDATA || '', 'Microsoft', 'Windows', 'Start Menu', 'Programs'),
    path.join(process.env.PROGRAMDATA || '', 'Microsoft', 'Windows', 'Start Menu', 'Programs'),
  ]

  for (const startMenuPath of startMenuPaths) {
    if (fs.existsSync(startMenuPath)) {
      shortcuts.push(...findShortcuts(startMenuPath))
    }
  }

  return shortcuts
}

// IPC 处理
ipcMain.handle('get-shortcuts', () => {
  return getStartMenuShortcuts()
})

ipcMain.on('launch-shortcut', (event, shortcutPath: string) => {
  shell.openPath(shortcutPath)
})
