import type { MenuItemConstructorOptions } from 'electron'
import path from 'node:path'
import { app, Menu, Tray } from 'electron'

export function createAppTray(
  onTrayClick: () => void,
  ...menuItems: MenuItemConstructorOptions[]
) {
  const trayIconPath = path.join(app.getAppPath(), 'public', 'favicon.ico')
  const tray = new Tray(trayIconPath)

  tray.setToolTip('tools')

  if (menuItems.length > 0) {
    const menu = Menu.buildFromTemplate(menuItems)
    tray.setContextMenu(menu)
  }

  tray.on('click', onTrayClick)

  return tray
}
