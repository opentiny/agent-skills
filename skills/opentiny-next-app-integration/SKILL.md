---
name: opentiny-next-app-integration
description: Use when an existing Vue 3 + Vite app needs OpenTiny TinyRobot Chat, GenUI, business WebMCP, business Skill, or PageTool integration and the installed APIs, ownership boundaries, or validation scope must be established from the project.
license: MIT
metadata:
  author: opentiny
  version: '1.0.0'
---

# OpenTiny Next 应用集成

在现有 Vue 3 + Vite 业务应用中增量接入 TinyRobot、GenUI、业务 WebMCP 和 PageTool。以目标项目实际安装的包、公开 API 和业务声明为准，不用演示组件、模拟工具或预设回答替代真实接入。

默认完成代码接入验证；只有用户明确要求验证对话、服务或端到端功能时，才执行相应运行时闭环。

## 选择阶段

只实施用户要求的阶段，并检查它依赖的已有能力。用户要求一次完成全部流程时，按下列依赖顺序执行；缺少运行时配置不阻塞后续代码接入。

| 阶段 | 目标 | 前置能力 | 详细参考 |
|---|---|---|---|
| 1 | TinyRobot Chat | Vue 3 + Vite 应用 | [TinyRobot 接入](references/opentiny-integration.md) |
| 2 | GenUI | 已接入的唯一 TinyRobot Chat | [GenUI 接入](references/genui-integration.md)、[模板适配](references/genui-template-adaptation.md) |
| 3 | 业务 WebMCP 与业务 Skill | TinyRobot runtime | [业务 WebMCP](references/webmcp-business-skill.md) |
| 4 | PageTool | TinyRobot 可消费的 WebMCP 通道 | [PageTool](references/pagetool-automation.md) |

若项目已具备某个前置能力，通过源码、依赖和构建证据确认后直接继续，不重复生成或重写。

第二、三阶段都会改变 `useLocalChatRuntime` 的请求或 MCP 所有权。实施前必须读取
[Runtime 所有权](references/runtime-ownership.md)，根据目标版本源码中的 guard 选择唯一所有者，不能把两个互斥入口叠加到同一个 runtime。

## 通用工作方式

1. 确认当前应用目录、Git 与 workspace 边界、包管理器、入口文件、现有聊天实现和 dirty 文件。所有命令都在目标应用边界内执行，保留用户改动。
2. 检查目标项目实际解析的包版本、exports、类型、源码和 runtime 参数校验，再决定导入路径与适配方式；不要只凭记忆或参考项目版本实现。
3. 优先复用项目已有组件、runtime、模型策略、业务状态和测试入口。全应用只保留一个聊天界面。
4. 依赖安装、代码生成或构建失败时，根据原始输出诊断；不要把失败命令、局部文件变化或 mock 结果报告成成功。
5. 业务工具合同和 PageTool 操作范围只来自业务方已有代码、业务合同或用户明确说明。缺少声明时可完成通用基础设施，但必须指出业务方需要修改的实际文件和字段，然后停止对应业务能力实现。

## 四个阶段

### 1. TinyRobot Chat

先查找项目中已有的 TinyRobot 组件和挂载链。不存在时，按 [TinyRobot 接入](references/opentiny-integration.md) 中当前锁定的已发布 CLI 执行 `add chat`，不使用 `create`。CLI 版本只约束生成器调用，不替代对目标项目 runtime 版本和 API 的检查。

CLI 生成文件或同名组件存在并不单独证明接入完成。继续前确认：依赖与 lockfile 可解析、`TrThemeProvider`/`TrChat` 使用当前包的有效导出、组件在真实入口链中只挂载一次、样式已接入。

### 2. GenUI

在现有 `TrChat` 上增加 GenUI，不创建第二个聊天面。兼容时可复用 `assets/genui-v1.3.0/`；版本或宿主结构不同则逐项适配。

保持普通文本路径、当前模型选择和宿主模型策略。GenUI 开关只改变已声明的请求路由与 schema 渲染行为；流式内容通过 `PatternExtractor` 解析，普通文本仍由 TinyRobot 渲染，只有有效 `schema-card` 进入 `GenuiRenderer`。认证方式和 prompt 结构必须来自服务合同。

若 GenUI 通过自定义 `responseProvider` 统一普通请求与 GenUI 请求，则它是唯一请求所有者；不要再向同一个 `useLocalChatRuntime` 传入 `modelProviders`。原有 provider 定义应迁入自定义 provider runtime，并显式连接当前模型，不能为消除冲突而删除模型选择能力。完成前检查最终 runtime 调用只保留一个请求所有者，并做不发送消息的本地挂载验证。

### 3. 业务 WebMCP 与业务 Skill

接入 Next SDK 的浏览器 WebMCP 初始化、TinyRobot adapter 和 `src/skills/**/SKILL.md` 加载链。adapter 从 `document.modelContext` 读取并执行真实 descriptor，不维护重复的业务 schema。

业务方负责在实际页面或业务模块中注册工具，并编写对应业务 Skill；工具名、参数、返回值、副作用和确认规则均以业务声明为准。不要根据页面字段、按钮、路由或示例生成业务工具。

工具注册作用域由可见性要求决定：仅在当前页面使用的工具可以随页面挂载；一条用户消息需要跨路由后继续调用、且当前 TinyRobot 在轮次开始时固定工具快照时，只将该流程依赖的业务工具迁移为应用级持久注册。迁移时删除页面同名注册，并保持业务合同和共享状态不变。具体规则见 [业务 WebMCP](references/webmcp-business-skill.md)。

Next SDK 必须是目标应用可追踪的直接依赖，并在客户端入口、`createApp` 和业务页面注册工具之前完成官方 WebMCP 初始化。自定义 adapter 是 MCP 唯一所有者时，不得同时向 `useLocalChatRuntime` 传入 `mcpServers`；已有真实 MCP server 不能静默删除，按 [Runtime 所有权](references/runtime-ownership.md) 合并或停止并报告。

adapter 必须按目标版本真实合同处理异步工具发现、模型可见的 server 命名空间、同一 descriptor 执行、参数序列化、`toolchange` 刷新和组件卸载清理。命中已验证版本范围时可使用 [业务 WebMCP](references/webmcp-business-skill.md) 中的版本化模板；否则逐项适配。

### 4. PageTool

使用目标项目当前 Next SDK 的公开 PageTool API，接入注册、TinyRobot adapter、通用观察流程和动作策略。

基础设施可以实现查询通道，但模型只能观察业务方声明的安全范围；没有声明时不暴露业务页面内容。页面目标、稳定标识、可操作动作和排除区域由业务方声明；未声明时不要自行给菜单、按钮或区块添加可操作语义。若 SDK 本身没有动作授权机制，在 adapter 执行前校验动作与目标。提交、删除、发布、支付等副作用应使用带业务 ID、权限和确认合同的专用 WebMCP 工具，不通过通用 PageTool 或提示词放行。

adapter 既要按业务策略收窄模型可见的 PageTool action schema，也要在执行前校验最新观察、ref 和稳定 target；工具名不能作为 PageTool action。目标版本支持时启用工具调用后的遮罩清理。命中已验证版本范围时可适配 `assets/webmcp-next-0.4.x-tinyrobot-0.5.2/pagetool/` 中的通用模板，业务 target policy 必须来自目标项目，不能写入通用资产。

## 配置与密钥

只在 `.env.example` 中补充所需变量的空占位。不要读取、输出、删除、覆盖、提交或硬编码真实 `.env` 和密钥。任何 `VITE_*` 值都会进入浏览器产物；需要保密的认证应由服务端或同源代理处理。

缺少模型 Key、GenUI URL、Prompt ID 或其他运行时配置时，保持相关功能不可启用，继续完成不依赖真实服务的代码接入，并在结果中列出待补配置。

## 验证与报告

默认验证范围：

- 依赖、lockfile、公开导出和真实挂载链；
- 与本次阶段有关的解析、请求路由、adapter、Skill 加载和动作策略测试；
- 项目已有的类型检查与生产构建。

第二、三阶段修改 runtime 接线后，默认复用已有本地服务，或启动 Agent 自己可清理的开发服务，完成不发送模型消息的挂载检查：

- 第二阶段打开唯一聊天面并检查 GenUI 控件：配置齐全时切换，缺配置时验证禁用态；两种情况都确认没有 runtime 配置异常；
- 第三阶段打开 MCP 面板，确认 server 与业务方已注册工具可见；没有业务声明时只确认初始化和空状态。

不占用或停止用户已有进程；只有 Agent 自己启动的服务才在验证后停止。默认不发送模型消息、不调用远程服务，也不采集截图。

当用户明确要求运行时验证时，只验证其点名范围，并完成真实用户路径：用户输入 → 实际模型或工具调用 → 可观察的聊天、页面或业务结果 → 助手反馈一致。截图按用户指定的分辨率，在首次加载页面前设置视口。

最终报告使用事实描述：修改了哪些文件、哪些检查通过或失败、哪些配置待补、哪些运行时能力未验证以及仍存在的风险。不要用自定义状态码替代这些事实。

## 范围边界

本 Skill 不内置业务工具、业务页面目标、模型供应商偏好或 Demo 数据。它提供集成通道、通用契约和安全边界；业务能力仍由目标应用定义。
