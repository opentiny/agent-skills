# GenUI 1.3.0 模板适配

本参考说明如何把 `assets/genui-v1.3.0/` 合并到已有 TinyRobot Chat。模板固定使用 GenUI `1.3.0` 的 API 形态，是一个版本化示例，不是默认安装路径，也不代表目标项目可以无条件复制。

## 模板清单

```text
assets/genui-v1.3.0/
└── genui/
    ├── GenuiProvider.vue
    ├── GenuiSwitch.vue
    ├── provider-runtime.ts
    ├── renderer.ts
    ├── request-routing.ts
    ├── stream-parser.ts
    └── stream-plugin.ts
```

这些文件分别提供 Provider/materials、sender 开关、模型与 response provider、异步 renderer、请求路由、跨 chunk 解析、message plugin 和内容解析辅助函数。资产只包含可适配的生产代码，不携带测试文件。

## 判断是否适用

先检查目标应用实际解析的依赖、exports、类型和现有源码，重点比较：

- GenUI 核心、Vue renderer 和 materials 是否与 `1.3.0` API 兼容；
- TinyRobot 是否提供模板使用的 runtime、message plugin、renderer 和 sender footer 能力；
- 目标应用是否已有同名模块或自定义请求链；
- 服务合同是否与模板中的 prompt/request 形态一致。

API 兼容时可复制独立模块并合并宿主接线；API 不同则逐项适配。不要为了套模板增加第二聊天面、覆盖已有文件或伪造兼容 API。

## 比较与合并

使用实际 Skill 目录和目标应用绝对路径进行比较：

```bash
SKILL_DIR=/absolute/path/to/opentiny-next-app-integration
TARGET_APP_DIR=/absolute/path/to/vue-app
diff -ru "$SKILL_DIR/assets/genui-v1.3.0/genui" "$TARGET_APP_DIR/src/tiny-robot-chat/genui"
```

目标目录不存在时可以复制模板模块；已存在时使用补丁逐项合并，保留目标项目业务代码。复制后按项目模块解析规则调整相对导入路径。

## 宿主接入点

### TinyRobot Chat

保留现有组件、窗口状态、模型配置和业务 slot，增加以下职责：

- 异步加载 `GenuiProvider`；
- 创建默认关闭的 GenUI 开关；
- 将 schema stream plugin 加入现有 conversation；
- 将自定义 response provider 连接到当前模型 runtime；
- 为后续业务 Skill 等系统 instructions 保留可选注入点；
- 把 GenUI renderer match 合并到现有 bubble provider；
- 在 sender 左侧能力工具区挂载 `GenuiSwitch`。TinyRobot `0.5.2-alpha.15` 的通用默认使用 `#sender-footer`；目标应用明确采用不同布局时，使用其等价能力工具区。

模板中可能出现类似接线：

```ts
const providerRuntime = createChatProviderRuntime({
  modelProviders,
  isGenuiEnabled: () => genuiEnabled.value,
  genuiUrl,
  genuiPromptId,
  getSkillInstructions: () => webSkillInstructions.value,
})

const runtime = useLocalChatRuntime({
  conversation: {
    useMessageOptions: {
      responseProvider: providerRuntime.responseProvider,
      plugins: [createGenuiSchemaStreamPlugin(() => genuiEnabled.value)],
    },
  },
})
```

片段刻意没有把 `modelProviders` 同时传入 `useLocalChatRuntime`：在该接线中，自定义 `responseProvider` 是唯一请求所有者，`modelProviders` 只作为 `createChatProviderRuntime` 的输入。`getSkillInstructions` 是可选扩展点，只在项目接入业务 Skill 后传入；它应在每次发送时读取最新内容并合并到请求消息。合并目标项目现有配置时不要把两个入口叠加。完整决策见 [Runtime 所有权](runtime-ownership.md)。

模板默认不向 GenUI origin 发送模型凭据。若服务合同要求认证，只能在目标项目适配服务明确允许暴露给浏览器的受限凭据；服务端秘密不得进入 runtime 参数或任何 `VITE_*` 变量。

模型 runtime 的连接方式必须通过当前 TinyRobot 类型和源码确认。如果该版本需要显式赋值或使用其他公开入口，按实际 API 接入并用测试保护“选中模型与真实请求模型一致”这一行为，不把模板中的某种写法当成跨版本结论。

### Chat UI

在已有 bubble 配置上合并拆分渲染、内容解析与 renderer match，保留原来的角色、头像、工具调用和布局配置。当前 TinyRobot `0.5.2-alpha.15` 的层级是：

```ts
bubble: {
  bubbleProvider: {
    contentRendererMatches: [createGenuiRendererMatch(isGenerating)],
  },
  bubbleList: {
    contentRenderMode: 'split',
    contentResolver: resolveGenuiContent,
    // 保留现有 roleConfigs 等配置
  },
}
```

`contentRenderMode`、`contentResolver` 属于 `bubbleList`，`contentRendererMatches` 属于 `bubbleProvider`。层级放错时 schema 可能已经被解析，却仍以 JSON 文本显示。没有 GenUI parts 时，`resolveGenuiContent` 必须返回原消息内容。

### 请求 runtime

每次发送时从当前 runtime 取得模型和能力状态。普通分支保留项目既有 endpoint、headers 和模型参数；GenUI 分支只使用 GenUI 服务允许的认证及 prompt 参数。两条分支的请求体都应与界面当前模型一致。

不要复制模板来源以外的模型 ID、供应商偏好、endpoint 或业务 prompt。

## 依赖与配置

目标项目选择 GenUI `1.3.0` 时，可按当前包管理器安装匹配依赖：

```bash
pnpm add @opentiny/genui-sdk-core@1.3.0 @opentiny/genui-sdk-vue@1.3.0 @opentiny/genui-sdk-materials-vue-opentiny-vue@1.3.0
```

其他版本必须按其公开 API 和兼容关系调整。只在 `.env.example` 中加入服务所需的空占位，不修改真实 `.env`。

## Vite 开发态兼容

先用实际控制台错误确认问题，不预置 workaround。GenUI `1.3.0` 与某些 Vite/Vue 依赖组合在首次异步加载 renderer 时，可能出现以下两类症状：

- `Failed to fetch dynamically imported module`：renderer 未在首次 schema 到达前完成依赖预构建；
- renderer 内部读取 Vue 组件实例失败（例如读取 `ce`）：预构建产物与宿主使用了不同 Vue runtime。

在目标项目复现这些症状并确认依赖版本后，可从最小配置开始验证：

```ts
export default defineConfig({
  optimizeDeps: {
    include: ['@opentiny/genui-sdk-vue/renderer'],
    exclude: ['vue'],
  },
  resolve: {
    dedupe: ['vue'],
  },
})
```

若 materials 的主题包入口解析失败，再针对目标项目实际安装的主题包处理 alias；不要从示例照抄绝对路径。每次只增加由当前错误证明必要的配置，并重新验证首次 schema 渲染。

## 验证

按项目现有测试能力或临时检查验证以下结果，然后运行项目对应的类型检查和生产构建：

- 跨 chunk 的文本/schema 顺序；
- sender footer 中的开关接入；
- 当前模型保持；
- 普通/GenUI 请求路由和认证隔离；
- renderer/provider 异步加载。
- 首个有效 schema 实际渲染为组件，而不是 JSON 文本；
- renderer 与宿主使用同一个 Vue runtime。

与模板文件一致只能说明模块未发生差异，不能替代项目构建或运行时验证。修改宿主 runtime 后还要完成不发送消息的本地挂载检查，确认聊天和 GenUI 开关不会触发所有权冲突。用户要求真实 GenUI 验证时，再发送一条能稳定产生交互 schema 的请求，检查 schema、renderer 与交互组件；不要只确认模型输出了 JSON。遇到依赖、样式或 bundler 错误时，以目标项目的实际错误和包 exports 为依据做最小修复，不把参考项目 workaround 预置到新项目。临时测试、fixture 和诊断代码在交付前删除，除非目标项目明确要将某项重要回归纳入长期测试。
