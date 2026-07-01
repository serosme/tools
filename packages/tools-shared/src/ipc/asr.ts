export interface AsrIPCChannels {
  'asr:result': {
    args: [_text: string]
    return: void
  }
  'asr:hide': {
    args: []
    return: void
  }
}

export interface AsrElectronAPI {
  asr: {
    /** 注册录音指令监听 (主进程 -> 渲染进程)，返回取消订阅函数 */
    onCommand: (_callback: (_cmd: 'start' | 'stop') => void) => () => void
    /** 渲染进程将识别结果发回主进程 */
    sendResult: (_text: string) => Promise<void>
    /** 渲染进程通知主进程隐藏录音窗 */
    hide: () => Promise<void>
  }
}
