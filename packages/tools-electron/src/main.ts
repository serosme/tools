import { exec } from 'node:child_process'
import { app, clipboard, globalShortcut, ipcMain, Menu } from 'electron'
import { uIOhook, UiohookKey } from 'uiohook-napi'
import { pathIpc } from './ipc/path.js'
import { shellIpc } from './ipc/shell.js'
import { windowIpc } from './ipc/window.js'
import { createAppTray, setRecordingTooltip } from './tray/index.js'
import { startRendererProcess, toggleDevToolsForFocusedWindow } from './utils/window.js'
import { useCommand } from './window/command.js'
import { useRecordHotkey } from './window/record-hotkey.js'
import { useRecordWindow } from './window/record.js'

// 移除默认菜单栏
Menu.setApplicationMenu(null)

app.whenReady().then(async () => {
  // 启动渲染进程
  startRendererProcess()

  // 启动命令面板
  const { create, toggle } = useCommand()
  await create()

  // 启动录音悬浮窗 (隐藏)
  const record = useRecordWindow()
  await record.create()

  // 注册 IPC
  pathIpc()
  shellIpc()
  windowIpc()

  // 注册全局快捷键
  globalShortcut.register('Alt+Space', () => toggle())
  globalShortcut.register('Ctrl+Shift+D', () => toggleDevToolsForFocusedWindow())

  // 创建系统托盘
  createAppTray(
    () => {},
    {
      label: '退出',
      click: () => {
        app.quit()
      },
    },
  )

  // 注册语音识别热键 (Push-to-Talk: 长按 CapsLock 录音，松手识别)
  uIOhook.start()

  useRecordHotkey(
    UiohookKey.CapsLock,
    200,
    450,
    () => {
      setRecordingTooltip(true)
      record.show()
      record.sendState('start')
    },
    () => {
      setRecordingTooltip(false)
      record.sendState('stop')
      // 延迟切换 CapsLock 重置大小写，冷却期由 record-hotkey 保证
      setTimeout(() => {
        uIOhook.keyTap(UiohookKey.CapsLock)
      }, 150)
    },
  )

  // IPC: 渲染进程回传识别结果 -> 写剪贴板 + 自动粘贴
  ipcMain.handle('asr:result', (_event, text: string) => {
    clipboard.writeText(text)
    setTimeout(() => {
      exec(
        'powershell -Command "(New-Object -ComObject WScript.Shell).SendKeys(\'^v\')"',
      )
    }, 50)
  })

  // IPC: 渲染进程请求隐藏录音窗
  ipcMain.handle('asr:hide', () => {
    record.hide()
  })
})

app.on('will-quit', () => {
  uIOhook.stop()
})
