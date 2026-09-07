# TinyRobot Runtime 所有权

本参考用于修改 `useLocalChatRuntime` 请求链或 MCP 接线。核心约束是：同一种能力只能有一个所有者。先读取目标项目实际安装版本的类型、源码和参数校验，再修改最终 runtime 调用。

## 修改前盘点

定位唯一 `useLocalChatRuntime`，记录：

- 请求入口：`modelProviders`、`responseProvider` 或项目已有自定义 provider；
- 模型状态：可选模型、当前模型、思考/搜索能力和发送前解析；
- MCP 入口：`mcpServers`、`mcp` 或已有高级 adapter；
- 现有 server/tool 是否为真实配置，不能把非空配置当成生成器占位；
- 当前版本在构造 runtime 时执行的互斥校验。

若源码包含类似以下错误，它们是硬合同，不是可忽略警告：

```text
useLocalChatRuntime: modelProviders and responseProvider cannot be configured at the same time.
useLocalChatRuntime: mcp and mcpServers cannot be configured at the same time.
```

## 请求所有权

| 当前情况 | 最终所有者 | 处理 |
|---|---|---|
| 只有普通模型 provider | 当前 TinyRobot 内置请求路径 | 保留 `modelProviders` |
| GenUI 需要在普通请求与 GenUI 服务间路由 | 一个自定义 `responseProvider` | provider 定义迁入自定义 runtime；不要再向 `useLocalChatRuntime` 传 `modelProviders` |
| 已有自定义 `responseProvider` | 现有 provider | 在其内部扩展路由，不创建第二个请求所有者 |

使用自定义 provider 时，模型 provider 配置仍可作为自定义 provider runtime 的输入；互斥的是同一个 `useLocalChatRuntime` 配置对象中的两个请求入口。连接完成后，当前模型、模型选项和真实请求体必须来自同一状态源。

目标版本适用时，接线形态可以是：

```ts
const providerRuntime = createChatProviderRuntime({
  modelProviders,
  isGenuiEnabled: () => genuiEnabled.value,
  genuiUrl,
  genuiPromptId,
})

const runtime = useLocalChatRuntime({
  conversation: {
    useMessageOptions: {
      responseProvider: providerRuntime.responseProvider,
      plugins,
    },
  },
})

runtime.composer.model = providerRuntime.model
```

这里不把 `modelProviders` 继续传给 `useLocalChatRuntime`。若当前版本使用不同公开入口，保持“单一请求所有者”和“模型状态一致”两个不变量，按实际 API 改写。

## MCP 所有权

| 当前情况 | 最终所有者 | 处理 |
|---|---|---|
| 没有真实 `mcpServers`，或仅为空占位 | 浏览器 WebMCP adapter | 使用唯一 `mcp`，移除同一 runtime 中的 `mcpServers` |
| 当前版本可直接统一消费远程 MCP 与浏览器 WebMCP | TinyRobot 公开统一入口 | 优先使用公开能力，不增加重复 adapter |
| 已有真实 `mcpServers`，且浏览器 WebMCP 需要高级 adapter | 一个组合高级 `mcp` | 合并 server、tool 状态、列举和调用能力 |
| 无法用公开 API 安全合并 | 暂不改变所有权 | 停止并报告现有 server、冲突点和需要用户决定的取舍 |

不得为了让浏览器工具工作而静默丢弃已有 MCP server，也不得把 `mcp` 和 `mcpServers` 同时传入后依赖运行时“自行选择”。

## 修改后静态门槛

逐项检查最终源码：

1. 全应用仍只有一个 `TrChat` 和一个实际 runtime；
2. 同一个 `useLocalChatRuntime` 中只存在一个请求入口；
3. 同一个 `useLocalChatRuntime` 中只存在一个 MCP 入口；
4. 原有模型选项、当前选择和能力状态没有因迁移而丢失；
5. 原有真实 MCP server 没有被静默删除；
6. 自定义 adapter 的生命周期在宿主卸载时结束。

## 本地挂载检查

修改第二、三阶段 runtime 接线后，类型检查和构建不能替代组件挂载检查，因为互斥错误可能只在 `setup()` 执行时抛出。

默认执行不调用远程服务的最小闭环：

1. 优先复用目标项目已有开发服务；否则使用可用端口启动服务并记录进程；
2. 打开实际业务入口和唯一聊天面；
3. 第二阶段检查 GenUI 控件；配置齐全时切换，缺配置时验证禁用态，并确认聊天仍挂载且没有 runtime 配置异常；
4. 第三阶段打开 MCP 面板，确认预期 server 和当前页面真实工具；
5. 不发送模型消息，不触发远程 GenUI 或业务工具；
6. 只停止本次由 Agent 启动的服务。

业务工具尚未声明时，第三阶段只验证 WebMCP 已初始化、adapter 可挂载且空工具状态正常。
