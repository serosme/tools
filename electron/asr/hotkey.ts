import { uIOhook, UiohookKey } from 'uiohook-napi'

interface HotkeyHandlers {
  onDown: () => void
  onUp: () => void
}

let handlers: HotkeyHandlers
let timer: NodeJS.Timeout | undefined
let armed = false

export function startHotkey(next: HotkeyHandlers): void {
  handlers = next
  uIOhook.on('keydown', handleKeydown)
  uIOhook.on('keyup', handleKeyup)
  uIOhook.start()
}

export function paste(): void {
  uIOhook.keyTap(UiohookKey.V, [UiohookKey.Ctrl])
}

export function restoreCapsLock(): void {
  setTimeout(() => uIOhook.keyTap(UiohookKey.CapsLock, []), 50)
}

function handleKeydown(e: { keycode: number }): void {
  if (e.keycode !== UiohookKey.CapsLock)
    return

  if (armed)
    return

  timer = setTimeout(() => {
    timer = undefined
    armed = true
    handlers.onDown()
  }, 150)
}

function handleKeyup(e: { keycode: number }): void {
  if (e.keycode !== UiohookKey.CapsLock)
    return

  clearTimeout(timer)
  timer = undefined

  if (!armed)
    return

  armed = false
  handlers.onUp()
}
