# AGENTS.md

## 项目概述

`tools` 是一款 Windows 桌面效率工具，结合 Electron + Nuxt 4 + Nuxt UI v4。提供命令面板（`Alt+Space`）、语音转文字（ASR）、音乐播放器、Mihomo 代理管理和工作区启动器。

- **版本**: 1.3.0 | **运行时**: Node.js 24.15.0（由 `mise.toml` 强制执行）

## Monorepo 结构

```text
packages/
  tools-electron/     Electron 主进程 + preload + 托盘
  tools-nuxt/         Nuxt 4 Web UI（渲染进程 + Nitro 服务端）
  tools-shared/       共享 TypeScript 类型、IPC 通道、配置 Schema
```

- **包管理器**: npm workspaces
- **模块系统**: ESM（所有包均设置 `"type": "module"`）

## 常用命令

| 命令                                | 说明                                                       |
| ----------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                       | 同时启动 Electron + Nuxt 开发服务器                        |
| `npm run build`                     | 构建 Nuxt，编译 Electron TS，然后 `electron-builder --win` |
| `npm run lint` / `npm run lint:fix` | ESLint（`@antfu/eslint-config`）                           |
| `npm run preview`                   | 生产预览                                                   |

## 架构

### Electron <-> 渲染进程

- **IPC 通道** 在 `packages/tools-shared/src/ipc/` 中强类型定义。各模块（`path.ts`、`shell.ts`、`window.ts`、`asr.ts`）分别导出 `XxxIPCChannels` 和 `XxxElectronAPI` 接口，再通过 `index.ts` 合并为 `IPCChannels` 和 `ElectronAPI`。
- `packages/tools-electron/src/main.ts` 中的 `handle()` 封装和 `preload.ts` 中的 `invoke()` 泛型函数利用这些类型确保编译时安全。
- 渲染进程通过 `window.electronAPI`（`contextBridge` 暴露）调用，由 `packages/tools-nuxt/app/utils/electron.ts` 封装。
- **ASR 推送事件**: 主进程用 `uiohook-napi` 监听 CapsLock 长按，通过 `ipcRenderer.on('asr:state', ...)` 向渲染进程推送 `start` / `stop` 信号。

### Nuxt 服务端

- Nitro h3 服务器运行在 `localhost:3000`。开发模式下 Electron 直接连接该地址；生产环境下 Electron 动态 `import()` Nitro 构建产物。
- **API 路由**: `packages/tools-nuxt/server/api/`，文件系统路由，每个文件导出 `defineEventHandler`。
- **服务端工具**: `packages/tools-nuxt/server/utils/`，由 Nitro 自动导入（`conf.ts`、`mihomo.ts`、`terminal.ts`）。

### 窗口管理

三种 BrowserWindow，均定义在 `packages/tools-electron/src/window/`（另含 `record-hotkey.ts`，负责 CapsLock 长按检测，非独立窗口）：

| 窗口     | 文件         | 行为                              |
| -------- | ------------ | --------------------------------- |
| 命令面板 | `command.ts` | `Alt+Space` 切换；失焦时隐藏      |
| 主页     | `home.ts`    | 通过 `window:create` IPC 按需创建 |
| 录音浮层 | `record.ts`  | 透明、置顶、不获取焦点            |

## 约定

- **文件命名**: kebab-case（`record-hotkey.ts`、`useCommand.ts`）
- **ESM 导入**: 相对导入始终使用 `.js` 扩展名，即使源文件是 `.ts`
- **Nuxt 自动导入**: 以下内容**无需手动 `import`**，框架已自动注入：
  - `app/` 端：Vue API（`ref`、`computed`、`watch`、`onMounted` 等）、Nuxt 组合式函数（`useFetch`、`useRouter`、`$fetch` 等）、`app/composables/` 下的 `useXxx` 函数、`app/components/` 下的所有组件
  - `server/` 端：`defineEventHandler`、`readBody`、`getQuery` 等 h3 工具，以及 `server/utils/` 下的所有导出（`conf`、`mihomo`、`terminal` 可直接使用）
  - `shared/types/` 中的类型（`Application`、`Music`、`WorkspaceProject`）在 Nuxt 端全局可用
  - **需要手动 `import`**：`tools-shared` 导出、npm 包（如 `pinyin-pro`、`@vueuse/core`）、Node.js 内置模块（如 `node:fs/promises`）、`@nuxt/ui` 的 TypeScript 类型
- **Vue 组合式函数**: `useXxx` 模式（`useCommand`、`useConf`、`useMusic`、`useSpeechRecognition`）
- **IPC 注册**: 命名空间函数 —— `pathIpc()`、`shellIpc()`、`windowIpc()` —— 各自注册其 handler，在 `main.ts` 中调用；ASR handler 直接内联在 `main.ts` 中
- **IPC 方向**: `invoke`/`handle` 用于渲染进程 -> 主进程请求/响应；`webContents.send`/`ipcRenderer.on` 用于主进程 -> 渲染进程推送（如 `asr:state`）
- **Lint**: `@antfu/eslint-config`，启用 Vue + 格式化工具
- **TypeScript**: 每个包有独立的 `tsconfig.json`

## 新增 IPC 通道

新增一个 IPC 功能模块需要修改 **4 个文件**，缺一不可。通道类型定义参照现有的 `path.ts`、`window.ts`、`asr.ts`。

### 步骤

1. **定义通道类型** —— `packages/tools-shared/src/ipc/xxx.ts`
   - 导出 `XxxIPCChannels` 接口（`args` 元组 + `return` 类型）
   - 导出 `XxxElectronAPI` 接口（暴露给渲染进程的 API 形状）
   - 若是推送通道（主进程 -> 渲染进程），在 `ElectronAPI` 中用 `ipcRenderer.on` 监听，返回取消订阅函数

2. **合并到总类型** —— `packages/tools-shared/src/ipc/index.ts`
   - 将 `XxxIPCChannels` 合并入 `IPCChannels`，`XxxElectronAPI` 合并入 `ElectronAPI`

3. **注册主进程 handler** —— `packages/tools-electron/src/ipc/xxx.ts`
   - 导出 `xxxIpc()` 函数，内部调用 `handle('channel', async () => {...})` 实现逻辑
   - 在 `packages/tools-electron/src/main.ts` 中调用 `xxxIpc()`
   - 推送通道则用 `webContents.send('channel', data)` 代替 `handle`

4. **暴露给渲染进程** —— `packages/tools-electron/src/preload.ts`
   - 在 `electronAPI` 对象上添加对应方法，invoke 通道用 `invoke('channel', ...args)`，推送通道用 `ipcRenderer.on`

### 检查清单

- [ ] `IPCChannels` 和 `ElectronAPI` 交叉类型已包含新模块
- [ ] `preload.ts` 中 `electronAPI` 对象已包含新模块
- [ ] `main.ts` 中已调用 `xxxIpc()`（或已注册内联 handler）
- [ ] 通道名称字符串与 `XxxIPCChannels` 的 key 完全一致

## 新增配置项（Schema 驱动）

配置项全部由 Schema 驱动，新增配置**无需创建页面或修改布局**。侧边栏导航、路由和表单通过 Schema 自动渲染。

### 步骤

1. **定义 TS 接口** —— `packages/tools-shared/src/conf/xxx.ts`
   - 仅含纯数据字段，不含 UI 元数据

   ```ts
   // 示例
   export interface AsrConf {
     key: string
   }
   ```

2. **桶式导出** —— `packages/tools-shared/src/conf/index.ts`
   - 添加 `export * from './xxx.js'`（注意 `.js` 扩展名）

3. **注册三项** —— `packages/tools-shared/src/store.ts`
   - `StoreSchema` 接口：添加 `xxx: XxxConf`
   - `schema` 对象：添加纯 JSON Schema（`type`、`default`、`properties`、`required`、`additionalProperties`），由 AJV 校验
   - `settings` 对象：继承 `schema.xxx`，添加 UI 元数据（`label`、`icon`、`properties[field].component` 等）

### 支持的 component 类型

| component        | 说明                                                     |
| ---------------- | -------------------------------------------------------- |
| `'text'`（默认） | 普通文本输入                                             |
| `'password'`     | 密码输入框                                               |
| `'path'`         | 文件夹路径，右侧带浏览按钮（调 Electron 原生目录选择器） |

### 涉及文件

**需修改**（3 个文件）：

| 文件                                      | 作用                                         |
| ----------------------------------------- | -------------------------------------------- |
| `packages/tools-shared/src/conf/xxx.ts`   | TS 接口定义                                  |
| `packages/tools-shared/src/conf/index.ts` | 桶式导出                                     |
| `packages/tools-shared/src/store.ts`      | `StoreSchema`、`schema`、`settings` 三项注册 |

**了解即可**（无需修改，Schema 驱动自动生效）：
`server/utils/conf.ts`、`server/api/conf/[key].{get,post}.ts`、`app/composables/useConf.ts`、`app/components/SettingForm.vue`、`app/layouts/setting.vue`

### 前端数据流

```text
SettingForm.vue --v-model--> conf(响应式) --provide/inject--> setting/[key].vue --$fetch POST--> /api/conf/[key]
```

- 加载: `useConf(key)` 在 `onMounted` 时调用 `$fetch('/api/conf/' + key)`
- 保存: 表单 `@submit` 触发 `$fetch` POST，body 为 `toRaw(conf)`（去除 Vue 响应式代理）

## 命令面板

使用 Nuxt UI v4 的 `CommandPalette` 组件，分组定义在 `packages/tools-nuxt/app/composables/useCommand.ts`。

### 核心机制

- **搜索**: 基于 Fuse.js，默认对 `label`、`description`、`suffix` 进行模糊搜索
- **keywords 字段**: `CommandPaletteItem` 支持通过 `[key: string]: any` 扩展任意属性；项目中利用 `keywords` 为中英文混合搜索提供额外索引
- **拼音搜索**: 应用列表使用 `pinyin-pro` 生成拼音和首字母放入 `keywords`，支持中文拼音模糊匹配
- **kbds**: 仅用于**展示**快捷键提示，不自动绑定快捷键
- **onSelect 修饰键**: 回调接收原生 `Event` 对象，可通过 `shiftKey`/`ctrlKey`/`altKey` 判断修饰键实现同一项不同操作

### 现有分组

| 分组 ID      | 内容                  | 搜索特性                               |
| ------------ | --------------------- | -------------------------------------- |
| pages        | Nuxt 路由页面         | 自动从路由表生成                       |
| commands     | Mihomo 启停命令       | 使用 `keywords` 扩展搜索               |
| terminals    | Windows Terminal 配置 | 从 WT `settings.json` 读取             |
| folders      | 常用文件夹快捷方式    | 硬编码路径                             |
| applications | Windows 已安装应用    | `pinyin-pro` 拼音搜索                  |
| workspace    | `~/workspace` 下项目  | 子菜单含 Terminal/VSCode/IDEA 打开方式 |
| quicks       | 动态快捷搜索          | `ignoreFilter: true`，关闭过滤直接执行 |

## 关键依赖

| 依赖               | 用途                              |
| ------------------ | --------------------------------- |
| Nuxt UI v4         | Vue 3 组件库（Tailwind CSS v4）   |
| `@nuxt/icon`       | Iconify 图标按需加载              |
| `@vueuse/core`     | Vue 组合式工具库                  |
| `conf`             | 基于 JSON 的持久化配置存储        |
| `uiohook-napi`     | 全局键盘钩子（CapsLock 即按即说） |
| `taglib-wasm`      | 音频文件元数据读取                |
| `pinyin-pro`       | 中文拼音搜索应用名称              |
| `electron-builder` | Windows 打包                      |
