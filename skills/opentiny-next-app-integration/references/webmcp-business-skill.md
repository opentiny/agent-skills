# 业务 WebMCP 与业务 Skill

本参考用于把业务方定义的浏览器 WebMCP 工具接入现有 TinyRobot。集成层负责通道和加载机制，业务方负责工具合同和领域说明。

## 先确认目标 API

检查目标项目当前安装的 Next SDK 与 TinyRobot 版本，核对：

- 浏览器 WebMCP 的初始化 API；
- `document.modelContext` 的工具注册、列举和执行方法；
- TinyRobot 的 MCP server/tool descriptor 与 adapter 接口；
- TinyRobot Kit 的 Skill front matter 解析和 plugin API。

常见接入形态包括 `initializeBuiltinWebMCP()`、`registerTool()`、`listTools()`/`getTools()` 和 `executeTool()`，但导入路径与方法签名必须以实际类型和源码为准。浏览器入口不要直接用于 Node/SSR 测试；需要测试纯转换逻辑时，将其与 DOM 初始化分离。

若当前 TinyRobot 已能直接消费浏览器 WebMCP，使用公开能力，不再添加自定义 adapter。

同时读取 [Runtime 所有权](runtime-ownership.md)，确认最终 TinyRobot 只使用一个 MCP 所有者。

## 初始化门槛

Next SDK 应是目标应用可追踪的直接依赖，不能只依赖其他包的传递安装。按目标版本公开导出，在真实客户端入口完成初始化，且顺序早于 `createApp` 和任何页面工具注册：

```ts
import { initializeBuiltinWebMCP } from '@opentiny/next-sdk'
import { createApp } from 'vue'

initializeBuiltinWebMCP()

const app = createApp(App)
```

具体函数和导入路径以目标版本为准。缺少直接依赖、入口没有初始化或初始化晚于业务页面挂载时，第三阶段不能报告完成。

已验证版本组合可参考 `assets/webmcp-next-0.4.11-tinyrobot-0.5.2-alpha.15/`：

- `@opentiny/next-sdk@0.4.11`
- `@opentiny/tiny-robot@0.5.2-alpha.15`
- `@opentiny/tiny-robot-chat@0.5.2-alpha.15`
- `@opentiny/tiny-robot-kit@0.5.2-alpha.15`

其中 `webmcp/webmcp-adapter.ts` 提供浏览器 WebMCP adapter，`webmcp/webmcp-tool-plugin.ts` 在每次模型请求前取得当前启用工具，`webmcp/web-skills.ts` 提供 `src/skills/**/SKILL.md` 加载链。只有实际解析版本和公开类型与模板匹配时才复制并合并；不匹配时把模板作为数据流参考，逐项适配。

## 职责边界

### Agent 接入通用基础设施

1. 在真实客户端入口初始化 Next SDK 浏览器 WebMCP；
2. 将当前页面注册的真实工具暴露给现有 TinyRobot runtime；
3. 接入 `src/skills/**/SKILL.md` 加载与解析链；
4. 保留现有聊天、模型、GenUI 和业务状态；
5. 用通用 descriptor 验证列举、参数序列化和执行透传。

这一阶段不需要知道业务工具名称，也不应创建新的业务工具 DSL、工具清单配置层或占位工具。

### 业务方声明真实能力

业务方在承载真实业务状态或服务的页面/模块中调用当前 SDK 的 `registerTool`。先根据工具可见性要求选择注册作用域：

| 使用要求 | 注册作用域 |
|---|---|
| 工具只在当前页面的业务状态或 UI 存在时成立 | 随页面挂载和卸载 |
| 工具的业务能力始终存在，并且执行不依赖页面实例 | 应用级持久注册 |

检查目标 TinyRobot 的 agent loop 或运行时源码，确认工具列表是在每次模型请求前重新生成，还是在整个用户轮次开始时形成快照。`toolchange` 能刷新 adapter 状态和工具面板，不单独证明新工具会加入正在进行的模型轮次。工具发现时机是 runtime 接线问题，不能反向决定业务注册作用域。

页面级工具的 Vue 生命周期接入通常形如：

```ts
import { onMounted, onUnmounted } from 'vue'

const abortController = new AbortController()

onMounted(() => {
  const modelContext = document.modelContext
  if (!modelContext) return

  modelContext.registerTool(
    {
      name: '<业务工具名>',
      description: '<能力与适用条件>',
      inputSchema: { type: 'object', properties: {} },
      execute: async (args) => {
        // 调用现有业务状态或服务
      },
    },
    { signal: abortController.signal },
  )
})

onUnmounted(() => abortController.abort())
```

代码应按目标 SDK 类型调整。工具的名称、参数、返回值、权限、错误、副作用与确认要求必须由业务方给出，不能根据表格字段、按钮、路由、Demo 或测试名推测。

如果验收要求一条消息跨页面连续调用，而当前 runtime 在轮次开始时固定工具快照，优先使用公开的逐模型请求工具 hook：

1. adapter 继续维护 MCP server/tool UI 状态，并从 `document.modelContext` 读取真实 descriptor；
2. 不再把该 adapter 交给会形成整轮快照的 `useLocalChatRuntime({ mcp })` 入口；
3. 使用 TinyRobot Kit 公开的 `toolPlugin`，在每次模型请求前先刷新 adapter，再根据当前启用状态列举工具；
4. plugin 的工具调用仍委托给同一个 adapter，不能复制 descriptor 或执行逻辑；
5. 将 `adapter.runtime` 单独连接到 `baseRuntime.composer.mcp`，保留 MCP 面板及启停控制；
6. 导航工具只有在目标页面 descriptor 注册完成后才返回，使后续 `requestNext()` 取得新页面工具。

TinyRobot Chat `0.5.2-alpha.15` 的接线形态如下，实际插件顺序与其他请求插件按目标项目合并：

```ts
const webmcpAdapter = createWebMcpAdapter()
const baseRuntime = useLocalChatRuntime({
  conversation: {
    useMessageOptions: {
      plugins: [createDynamicWebMcpToolPlugin(webmcpAdapter)],
    },
  },
})

baseRuntime.composer.mcp = webmcpAdapter.runtime
```

若目标版本没有公开的逐请求工具 hook，则说明同一轮跨路由能力受限，并等待运行时升级或由业务方重新确认作用域；不能操作私有快照字段，也不能仅为绕过快照把页面能力伪装成应用级能力。

业务方同时在 `src/skills/<业务名>/SKILL.md` 编写领域 instructions。缺少工具声明或业务 Skill 时，先定位目标项目中承载业务状态、工具生命周期和 Skill 加载的位置，再明确列出业务方应修改的实际文件及所需字段，然后停止业务能力实现。

## 数据与生命周期

保持以下关系：

```text
客户端入口 → 初始化浏览器 WebMCP
业务页面或应用模块 → 按可见性要求注册和卸载真实工具
业务状态/API → 页面与工具共同使用的事实源
TinyRobot adapter → 列举并调用当前 descriptor
业务 Skill → 告诉模型何时、如何使用这些能力
```

- 初始化早于工具注册；
- 页面级工具随页面切换清理，应用级工具只在应用或 HMR 生命周期清理；
- 页面与工具共享同一业务状态/API，不用 DOM selector 或日志模拟执行成功；
- 工具列表可能随页面变化，adapter 应读取当前 descriptor，避免维护会漂移的副本；
- 每次模型请求使用当时已经注册且启用的 descriptor；形成整轮快照的版本使用公开动态工具 plugin 兼容；
- 工具若产生会影响后续模型决策的页面状态变化，应在工具合同中说明，并在相关状态稳定后返回；结果只陈述已经完成的可观察状态；
- 保留唯一 `TrChat` 和既有宿主模型策略。

## Adapter

根据当前 TinyRobot 类型实现最薄的 adapter：

1. 提供稳定的 server ID；
2. `listTools`/`getTools` 可能是异步方法，必须 `await` 后再从真实 descriptor 生成模型可见工具信息；
3. 为模型提供“server ID + 双下划线 + descriptor name”形式的命名空间工具名，同时保留原名用于执行；
4. 列举时只返回当前安装且启用的工具；
5. 调用时重新取得当前 descriptor；已验证组合使用同一 descriptor 与 `JSON.stringify(args ?? {})` 调用 `executeTool`，其他版本按真实签名适配；
6. 监听当前 API 的工具变化事件，使后续列举能看到页面挂载后注册的工具，并在组件卸载时移除监听；不要把事件刷新等同于正在进行的模型轮次会更新工具快照；
7. 对未知 server/tool、缺失浏览器 API 和执行异常返回清晰的结构化错误。

adapter 不改写业务参数或结果，也不在另一处复制业务 schema。

若使用高级 `mcp: adapter`，同一个 `useLocalChatRuntime` 不再同时传入 `mcpServers`。TinyRobot Chat `0.5.2-alpha.15` 为动态页面工具改用 `toolPlugin` 时，也不要同时传入会重复暴露同一批工具的 `mcp`；仅把 adapter runtime 连接到 composer MCP 面板。现有真实 MCP server 必须先合并到一个工具所有者，无法安全合并则停止并报告。

## 业务 Skill 内容

业务 Skill 至少说明：

- 当前提供的真实能力及适用意图；
- 自然语言与工具参数的稳定映射；
- 歧义时是先查询还是向用户澄清；
- 查询与变更工具的区别；
- 返回结果、业务错误和限制；
- 副作用范围、权限和确认规则；
- 成功后依据工具结果反馈，失败时不虚构业务状态。
- 专用工具结果已经足以完成用户目标时直接回答；只有结果不足、工具报告失败，或用户明确要求额外检查页面时，才继续调用 PageTool。

业务 Skill 只提供领域说明，不直接修改页面状态，也不把预设答案写入聊天消息。

### Skill 加载与请求接线

在 Vite 应用中可以用 `import.meta.glob('../../skills/**/SKILL.md', { eager: true, query: '?raw', import: 'default' })` 收集原始 Markdown，再使用目标 Next SDK 的 `getMainSkillPaths`、`getSkillOverviews` 和 `getSkillMdContent` 解析入口与正文。相对 glob 路径必须从复制后的模块位置重新确认，不能假设目标项目目录与模板相同。

解析后的 instructions 进入当前唯一模型请求链，而不是独立发起请求：

- 仍使用 TinyRobot 原生 `modelProviders` 时，按当前版本公开的 Skill/plugin 接口接入；
- Step2 已使用自定义 `responseProvider` 时，把读取最新 instructions 的函数传给现有 provider runtime，在发送时合并为 system message；
- 保留已有 system message 的顺序和内容，不覆盖模型、GenUI prompt、工具或业务上下文；
- Skill 尚未加载完成或没有有效正文时不注入空消息。

模板只负责加载与传递通道，不包含订单等特定业务 instructions。业务 Skill 仍保存在目标项目的 `src/skills/<业务名>/SKILL.md`。

## 验证

基础设施测试保护通用合同：

1. 客户端入口完成官方初始化；
2. adapter 能发现任意后续注册的 descriptor；
3. adapter 使用同一 descriptor 调用执行方法并正确传递参数；
4. `SKILL.md` 能转换为当前 TinyRobot 接受的 Skill definition；
5. 已有普通文本、GenUI 和模型策略不回归。

业务声明存在后，再根据真实合同测试 schema、业务状态、错误、权限和副作用。不要为了让测试通过而创建虚构业务工具。

默认还要完成不发送消息的本地挂载检查：打开实际业务页面和 TinyRobot MCP 面板，确认 browser server 与当前页面已注册工具可见；没有业务工具声明时确认初始化和空状态。只有用户明确要求验证业务 WebMCP 功能时，才通过自然语言触发真实工具，并核对实际业务状态与助手反馈一致。

## 与 PageTool 的边界

业务 WebMCP 适合稳定、可审计的领域操作；PageTool 适合受限的页面观察和交互。提交、删除、发布等需要业务 ID、权限或确认的动作优先使用专用业务工具，不交给通用 PageTool。专用工具结果已经足以完成用户目标时，PageTool 不再为同一目标做重复观察。
