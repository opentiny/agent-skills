# GenUI 接入

本参考用于在已有 TinyRobot `TrChat` 中增加 GenUI。它描述稳定的数据流和验证边界；具体导入路径、slot、runtime API 与请求合同以目标项目实际安装版本为准。

## 接入前检查

先定位并核对：

- 唯一 `TrChat` 的组件、runtime 和应用挂载链；
- 当前模型列表、选择状态、思考/搜索能力与请求路径；
- TinyRobot 的 message plugin、bubble renderer、sender footer 和 response provider API；
- 目标项目现有 GenUI 依赖、配置与测试入口。

保留已有聊天状态、业务 slot、模型策略和 dirty 文件。不要根据参考项目推断目标版本 API。

修改 runtime 前读取 [Runtime 所有权](runtime-ownership.md)。重点检查当前版本是否把 `modelProviders` 与自定义 `responseProvider` 视为互斥入口。

## 依赖与版本化模板

直接使用 `PatternExtractor`、Vue renderer/provider 或 OpenTiny Vue materials 时，相应包应是目标应用可追踪的直接依赖，并采用彼此兼容的版本。

`assets/genui-v1.3.0/` 是 GenUI `1.3.0` 的版本化模板。只有目标项目的 TinyRobot 与 GenUI API 兼容时才复用；否则把它作为数据流示例逐项适配。具体方法见 [模板适配](genui-template-adaptation.md)。

不要因参考项目曾经需要某个主题包、Vite alias 或 dedupe 配置，就预先修改目标项目。只有当前安装版本和实际错误证明需要时才处理依赖兼容问题。若 schema 已解析但卡片区域报动态导入失败，或 renderer 报 Vue 实例上下文为空，按 [模板适配](genui-template-adaptation.md) 的 bundler 兼容检查定位。

## 单一聊天面

保持以下职责：

```text
TrChat（唯一聊天面）
├─ sender footer → GenUI 开关
├─ response provider
│  ├─ GenUI 关闭 → 当前普通模型请求路径
│  └─ GenUI 开启 → 已配置的 GenUI 请求路径
└─ assistant stream → PatternExtractor
   ├─ 普通文本 → TinyRobot 文本 part
   └─ 有效 schema-card → GenuiRenderer
```

不要增加第二个对话框、自制聊天壳、本地假卡片或预设回答。普通文本、思考内容、工具调用和 WebMCP 仍由同一个 TinyRobot runtime 管理。

## 请求所有权

GenUI 需要在普通模型请求与 GenUI 服务之间动态路由时，使用一个自定义 `responseProvider` 统一拥有两条路径。目标项目原有 `modelProviders` 可以传给自定义 provider runtime，但不要同时传给同一个 `useLocalChatRuntime`。

接入时按以下顺序检查：

1. 读取当前 `useLocalChatRuntime` 的实际类型和构造 guard；
2. 将普通模型 provider、当前模型和能力状态接入自定义 provider runtime；
3. 最终 `useLocalChatRuntime` 只接收 `responseProvider`；
4. 按当前公开 API 把 provider runtime 的模型状态连接回 composer；
5. 后续业务 Skill 等系统 instructions 通过该 provider 的显式注入点合并到本轮消息，不另建请求入口；
6. 核对模型选项、当前模型、界面显示和请求体没有漂移。

不能通过删除模型选项、硬编码模型 ID 或保留两个入口来规避所有权迁移。

## 流式解析与渲染

1. 使用 `PatternExtractor` 跨增量 chunk 识别 schema，不能对单个 chunk 独立 `JSON.parse`；
2. 通过当前 TinyRobot message plugin API 按原顺序保存文本和 `schema-card`；
3. 在 `bubble.bubbleList` 配置拆分渲染与内容解析，在 `bubble.bubbleProvider` 注册 renderer match；不要把三者放到同一层；
4. 普通文本继续使用 TinyRobot 默认内容渲染；
5. 只有结构有效的 `schema-card` 进入 `GenuiRenderer`，未知类型、不完整 schema 和解析错误不能吞掉相邻文本；
6. Provider、renderer 和体积较大的 materials 使用异步加载，避免阻塞聊天入口。

GenUI 关闭时不启用 schema 解析插件，普通聊天路径必须保持可用。

## 开关与模型策略

默认将 GenUI 开关挂载到 sender 左侧工具区，与思考、搜索等能力开关同组。TinyRobot `0.5.2-alpha.15` 使用 `#sender-footer`；`#sender-footer-right` 属于模型、字数等右侧状态区。目标应用已有明确布局约定时，使用其等价能力工具区。

```vue
<template #sender-footer>
  <GenuiSwitch :enabled="genuiEnabled" :available="genuiAvailable" @toggle="genuiEnabled = $event" />
</template>
```

开关默认关闭；缺少必需配置时禁用，并明确提示待补变量。保留可访问名称、按下状态和原生禁用状态。

GenUI 是能力开关，不是虚构的模型。没有明确服务合同或宿主策略时，切换它不得修改当前模型。若宿主确实为不同模式规定了模型范围，则模型选项、选中值和发送前解析必须使用同一策略，确保界面显示与真实请求一致。

自定义 response provider 每次发送时读取当前模型。开关只决定请求目标和服务合同规定的 GenUI 参数：

```text
body.model = 当前实际选择的模型
```

URL 规范化、prompt 结构、思考/搜索参数和额外 headers 都必须来自目标服务或模型 provider 的合同，不能从模板臆造。

## 配置与认证

只在 `.env.example` 中增加需要的空占位，例如：

```dotenv
VITE_GENUI_URL=
VITE_GENUI_PROMPT_ID=
```

只有 URL 和 Prompt ID 等服务必需项齐全时才能启用 GenUI。API key 是否必需、使用 Bearer 还是宿主会话，由服务合同决定。只有服务明确提供可暴露给浏览器的受限凭据时，才增加类似 `VITE_GENUI_API_KEY` 的变量；它不能承载服务端秘密。

普通模型凭据不能转发到不同来源的 GenUI 服务。需要保密的认证不得放入 `VITE_*`；应通过服务端或同源代理处理。不要读取、回显或修改真实 `.env`。

## 验证

验证至少覆盖以下结果；优先复用项目已有测试入口，临时验证文件在完成前删除：

1. 被拆分到不同 chunk 的 schema 仍能解析，文本与卡片顺序不丢失；
2. GenUI 开关关闭时普通文本路径正常；
3. 当前模型在界面、runtime 和请求体中保持一致；
4. 普通请求与 GenUI 请求路由正确，模型凭据不会泄漏到 GenUI origin；
5. Provider/renderer 使用异步加载；
6. 首次收到 schema 时异步 renderer 能加载，并与宿主共用同一个 Vue runtime；
7. 类型检查和生产构建通过。

最终分别说明代码接入、配置、测试、构建、本地挂载和真实服务验证情况。构建成功不证明 runtime 能挂载，也不证明远程 endpoint、认证或 schema 响应可用。

默认启动或复用本地服务，打开唯一聊天面并检查 GenUI 控件：配置齐全时切换，缺配置时验证禁用态；两种情况都确认没有 runtime 配置异常，并且不发送消息。只有用户明确要求验证 GenUI 远程功能时，才继续完成：发送真实请求 → 收到有效 schema → 页面实际渲染，同时确认普通文本和当前模型没有回归。
