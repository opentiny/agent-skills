# 业务 WebMCP 与业务 Skill

本参考用于把业务方定义的浏览器 WebMCP 工具接入现有 TinyRobot。集成层负责通道和加载机制，业务方负责工具合同和领域说明。

## 先确认目标 API

检查目标项目当前安装的 Next SDK 与 TinyRobot 版本，核对：

- 浏览器 WebMCP 的初始化与 navigator API；
- `document.modelContext` 的工具注册、列举和执行方法；
- TinyRobot 的 MCP server/tool descriptor 与 adapter 接口；
- TinyRobot Kit 的 Skill front matter 解析和 plugin API。

常见接入形态包括 `setNavigator`、`initializeBuiltinWebMCP()`、`registerTool()`、`listTools()`/`getTools()` 和 `executeTool()`，但导入路径与方法签名必须以实际类型和源码为准。浏览器入口不要直接用于 Node/SSR 测试；需要测试纯转换逻辑时，将其与 DOM 初始化分离。

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

已验证版本组合可参考 `assets/webmcp-next-0.4.x-tinyrobot-0.5.2/`：

- `@opentiny/next-sdk@0.4.x`
- `@opentiny/tiny-robot-chat@0.5.2-alpha.x`

只有实际解析版本和公开类型与模板匹配时才复制并合并；不匹配时把模板作为数据流参考，逐项适配。

## 职责边界

### Agent 接入通用基础设施

1. 在真实客户端入口初始化 Next SDK navigator 和浏览器 WebMCP；
2. 将当前页面注册的真实工具暴露给现有 TinyRobot runtime；
3. 接入 `src/skills/**/SKILL.md` 加载与解析链；
4. 保留现有聊天、模型、GenUI 和业务状态；
5. 用通用 descriptor 验证列举、参数序列化和执行透传。

这一阶段不需要知道业务工具名称，也不应创建新的业务工具 DSL、工具清单配置层或占位工具。

### 业务方声明真实能力

业务方在承载真实业务状态或服务的页面/模块中调用当前 SDK 的 `registerTool`。先根据工具可见性要求选择注册作用域：

| 使用要求 | 注册作用域 |
|---|---|
| 工具只在当前页面使用，允许进入页面后的下一轮再调用 | 随页面挂载和卸载 |
| 一条用户消息需要先跨路由导航，再在同一轮调用业务工具 | 应用级持久注册，并在 TinyRobot 本轮工具快照形成前可见 |

检查目标 TinyRobot 的 agent loop 或运行时源码，确认工具列表是在每次模型请求前重新生成，还是在整个用户轮次开始时形成快照。`toolchange` 能刷新 adapter 状态、工具面板或后续列举，不单独证明新工具会加入正在进行的模型轮次。

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

如果验收要求一条消息跨页面连续调用，而当前 runtime 在轮次开始时固定工具快照，Agent 应只迁移该流程依赖的业务工具：

1. 将原 descriptor 和执行逻辑迁入应用级业务工具模块；
2. 在浏览器 WebMCP 初始化之后、`createApp` 和 TinyRobot 挂载之前注册；
3. 删除页面中同名的 `registerTool`、页面级 signal 和卸载代码，避免重复 descriptor；
4. 页面与应用级工具共享现有 store、composable、响应式状态或业务 API，不使用 DOM selector 代替业务执行；
5. 保持工具名、参数 schema、结果、权限和确认合同不变；
6. 如果工具只能在特定路由执行，返回明确的路由前置条件，导航完成后允许重试原工具；
7. 使用应用级或 HMR 生命周期清理注册，不再随业务路由卸载。

不要为了 PageTool 无差别迁移全部业务工具。依赖无法安全抽离的组件实例、临时 DOM ref 或页面私有状态时，指出具体依赖并停止迁移。

应用入口的接线形态如下，函数名和参数仍以目标项目的真实业务模块为准：

```ts
initializeBuiltinWebMCP()
registerDeclaredBusinessTools()

const app = createApp(App)
```

`registerDeclaredBusinessTools()` 必须复用业务方已经确认的 descriptor 和执行逻辑，不是让 Agent 生成占位工具。

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
- 当前轮次需要跨路由调用的 descriptor 必须在该轮工具快照形成前可见；
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

若使用高级 `mcp: adapter`，同一个 `useLocalChatRuntime` 不再同时传入 `mcpServers`。现有 `mcpServers` 为空占位时可移除；包含真实 server 时必须先合并到一个 MCP 所有者，无法安全合并则停止并报告。

## 业务 Skill 内容

业务 Skill 至少说明：

- 当前提供的真实能力及适用意图；
- 自然语言与工具参数的稳定映射；
- 歧义时是先查询还是向用户澄清；
- 查询与变更工具的区别；
- 返回结果、业务错误和限制；
- 副作用范围、权限和确认规则；
- 成功后依据工具结果反馈，失败时不虚构业务状态。

业务 Skill 只提供领域说明，不直接修改页面状态，也不把预设答案写入聊天消息。

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

业务 WebMCP 适合稳定、可审计的领域操作；PageTool 适合受限的页面观察和交互。提交、删除、发布等需要业务 ID、权限或确认的动作优先使用专用业务工具，不交给通用 PageTool。
