# AGENTS.md

Windows 专属桌面应用：Nuxt 4 SPA 渲染层 + Electron 主进程；Nuxt 的 Nitro 服务同时充当 Electron 应用的本地后端。

## 命令

包管理器固定为 **pnpm**（`packageManager` 字段，当前 `12.18.0`），不用 npm / yarn。

| 命令 | 说明 |
| --- | --- |
| `pnpm install` | 通过 `postinstall` 执行 `nuxt prepare`；类型检查前需先安装 |
| `pnpm dev` | 同时启动 Nuxt 服务（端口 **2080**）与 Electron |
| `pnpm lint` · `pnpm lint:fix` | ESLint（`@antfu` 配置） |
| `pnpm typecheck` | `nuxt typecheck && tsc -p electron/tsconfig.json`，覆盖渲染层与 Electron 主进程 |
| `pnpm build` | 先 `nuxt:build` 再 `electron:build`，顺序不能反 |

- 没有任何测试。改动校验顺序为 `pnpm lint` 再 `pnpm typecheck`；`nuxt build` 不做类型检查。
- **TypeScript 固定 `6.0.3`，不要升 7**：TS 7 是 Go 原生移植、不提供 compiler API，`vue-tsc` 找不到 `typescript/lib/tsc`，`@typescript-eslint`（antfu 配置依赖）会直接抛错。恢复条件是 TS 7.1 提供 API 且 vue-tsc / typescript-eslint 支持。
- `pnpm dev` 用 `run-p --race`：Nuxt 或 Electron 任一方退出都会终止整个 dev，不要只盯着其中一个日志排错。

## 关键接线

以下内容不易从文件名或配置推断：

- 目录职责：`app/` 是渲染层，`server/` 是 Nitro 本地 API，`electron/` 是主进程，`shared/` 是跨端类型。
- Electron 主进程是 **直接运行的 TypeScript**：`package.json` 的 `main` 指向 `electron/index.ts`，编译配置继承 `@tsconfig/node-ts`。`electron/` 内的相对导入必须保留显式 `.ts` 后缀（如 `./ipc/index.ts`），Node 的类型擦除依赖它，不要顺手去掉。
- Electron 45 起 sandboxed preload 不再提供 `Buffer`、`setImmediate` / `clearImmediate` 与 `events` / `timers` / `url` 模块：`electron/preload.cjs` 只能依赖 `require('electron')` 的 `contextBridge` / `ipcRenderer`，不要在 preload 里引入需要 polyfill 的 Node API。
- `electron:dev` 里的 `CI=1` 与 `nuxt:dev` 的 `--no-tui` 都用于避免各自的 TUI 吞掉对方日志：Nuxt CLI v4 默认会给 `nuxt dev` 画交互面板，在 `run-p` 并行下会与 Electron 输出抢终端。
- 开发与打包的服务来源不同：打包后 `electron/server/index.ts` 直接 import 构建产物 `.output/server/index.mjs`（`NITRO_PORT` / `HOST` 为 2080 / localhost）；开发时仅等待 `nuxt dev` 在 2080 上就绪。
- `server/utils/**` 与 `shared/**` 都是自动导入：服务端可直接调用 `readConf`、`musicPath`、`spawnProcess` 等，渲染层与服务端都可直接使用 `shared` 里的类型（如 `Music`），都不要手动 import。
- 可移植的服务端代码从 `nuxt/server` 显式导入 `defineEventHandler` / `getQuery` / `readBody` / `createError` 等（Nuxt 4.6+）。**同一文件必须统一来源**：与 h3 的同名自动导入混用会报 `NUXT_E8012`，且 event 形状不同（`event.req` / `event.url` / `event.res`，错误用 `status` / `statusText`）。返回二进制或流时用 `new Response(...)`（Node `Readable` 先 `Readable.toWeb`），不要直接 `return` 原始的 `Uint8Array` 或 Node 流。
- `pnpm-workspace.yaml` 用 `allowBuilds` 白名单放行依赖的安装脚本（当前为 `esbuild`、`vue-demi`）；pnpm 默认阻止依赖执行构建脚本，新增需要构建的依赖时要一并加进去。该文件还设了 `nodeLinker: hoisted`、`trustPolicy: no-downgrade`、`minimumReleaseAge: 1440`（strict）：发布时间不足 24 小时的版本不会被安装或升级，需要等待或加 `minimumReleaseAgeExclude`；降级会被 `trustPolicy` 拦截，需加 `trustPolicyExclude`。
- Nuxt 配置为 `ssr: false`，启用 `experimental.routeTypedFetch` + `strictRouteTypes`：`$fetch`/`useFetch` 的路径与 method 由生成的路由类型校验，拼错路径或不支持的 method 直接报类型错误。渲染层的 `selfFetch` 从 `#build/fetch` 显式导入 `$fetch` 正是为了拿到这套类型。
- 所有 `/api` 路由都会经过 `server/middleware/local-guard.ts`，仅允许 localhost 与 same-origin。
- 配置为 `~/.config/tools/tools.toml`，用 smol-toml 解析并由 `readConf()` 在内存中缓存；字段有 `music.path`。配置缺失或格式错误会在请求时导致 Music 失败。
- Windows 专属原生依赖：`taglib-wasm`；命令预设会调用 `powershell` / `explorer.exe` / `wt.exe`。
- taglib-wasm 的 simple API 写入边界：`TagInput` 不含 `lyrics`，写歌词只能用 `getTagLib().edit()` + `audioFile.setLyrics()`；`clearTags` 没有写盘变体，`tags.delete.ts` 保持 buffer + `writeFile`。`clearTags(path)` 自 2.4.1 起为纯读，但内部仍会整文件读取，换写法没有性能收益。

## 防御性编程（重要）

这是个人项目：数据来源、配置与使用方式都符合规范且可信（本机环境与自家客户端）。因此**默认不要写防御性代码**：

- 不为**不可能发生**的情况加非空校验、`try/catch` 兜底、越界或类型判断；只有当输入来自真正的外部或不可信边界时才校验。
- `noUncheckedIndexedAccess` 要求索引访问使用 `!` 断言；对可信来源（固定映射表、上游已校验的值）保持断言即可，不要展开成运行时分支。
- 不要预先引入缓存、抽象层或**以防万一**的重试与降级；先确认存在确凿的实际问题再动手。
- 改动保持最小：优先修真实缺陷，而不是理论上更**规范**。

## 约定

- 渲染层请求统一走 `app/utils/selfFetch.ts`（出错弹 toast）与 `useSelfFetch`；组件和 composable 由 Nuxt 自动导入。
- 命令面板分组是文件式的：在 `app/command-groups/*.ts` 加一个工厂函数即可，`useCommand` 通过 `import.meta.glob` 自动收集。
- 注释用中文；ESLint（`@antfu`）要求无分号、单引号。`electron/preload.cjs` 有意被 ESLint 忽略，因为它属于 CJS。
- `.github/workflows/release.yml` 在**任意 push** 时都会重新发布 `latest` GitHub release（无分支过滤）——不要随手推无关或 WIP 提交。
