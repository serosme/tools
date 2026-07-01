import { uIOhook } from 'uiohook-napi'

/**
 * 长按全局热键驱动 Push-to-Talk 录音。
 * - keydown 超过 longPressMs 触发 onStart
 * - keyup 触发 onStop，然后进入 cooldownMs 冷却期（屏蔽 keyTap 产生的虚假事件）
 */
export function useRecordHotkey(
  hotkey: number,
  longPressMs: number,
  cooldownMs: number,
  onStart: () => void,
  onStop: () => void,
) {
  let isRecording = false
  let pressTimer: ReturnType<typeof setTimeout> | null = null
  let keyupDebounce: ReturnType<typeof setTimeout> | null = null
  let ignoring = false

  function start() {
    if (isRecording)
      return
    isRecording = true
    onStart()
  }

  function stop() {
    if (!isRecording)
      return
    isRecording = false
    onStop()

    ignoring = true
    setTimeout(() => {
      ignoring = false
    }, cooldownMs)
  }

  uIOhook.on('keydown', (e) => {
    if (e.keycode !== hotkey || ignoring)
      return
    if (isRecording) {
      if (keyupDebounce) {
        clearTimeout(keyupDebounce)
        keyupDebounce = null
      }
      return
    }
    pressTimer = setTimeout(() => {
      pressTimer = null
      start()
    }, longPressMs)
  })

  uIOhook.on('keyup', (e) => {
    if (e.keycode !== hotkey || ignoring)
      return
    if (pressTimer) {
      clearTimeout(pressTimer)
      pressTimer = null
      return
    }
    if (isRecording) {
      if (keyupDebounce)
        clearTimeout(keyupDebounce)
      keyupDebounce = setTimeout(() => {
        keyupDebounce = null
        stop()
      }, 80)
    }
  })
}
