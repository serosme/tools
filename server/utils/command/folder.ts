import { homedir } from 'node:os'
import { join } from 'node:path'

const home = homedir()

const folderPaths: Record<string, string> = {
  'Desktop': join(home, 'Desktop'),
  'Startup': join(home, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup'),
  'Downloads': join(home, 'Downloads'),
  'Documents': join(home, 'Documents'),
  'AppData': join(home, 'AppData'),
  'Rime': join(home, 'AppData', 'Roaming', 'Rime'),
  'Windows Terminal': join(home, 'AppData', 'Local', 'Packages', 'Microsoft.WindowsTerminal_8wekyb3d8bbwe', 'LocalState'),
  'Scoop': join(home, 'scoop'),
  'Config': join(home, '.config'),
}

export function getFolderNames(): { name: string }[] {
  return Object.keys(folderPaths).map(name => ({ name }))
}

export function getFolderPath(name: string): string {
  return folderPaths[name]!
}
