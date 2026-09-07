# GenUI 1.3.0 模板适配

本参考说明如何把 `assets/genui-v1.3.0/` 合并到已有 TinyRobot Chat。模板固定使用 GenUI `1.3.0` 的 API 形态，是一个版本化示例，不是默认安装路径，也不代表目标项目可以无条件复制。

## 模板清单

```text
assets/genui-v1.3.0/
├── genui/
│   ├── GenuiProvider.vue
│   ├── GenuiSwitch.vue
│   ├── provider-runtime.ts
│   ├── renderer.ts
│   ├── request-routing.ts
│   ├── stream-parser.ts
│   └── stream-plugin.ts
└── tests/
    └── genui-integration.test.mjs
```

这些文件分别提供 Provider/materials、sender 开关、模型与 response provider、异步 renderer、请求路由、跨 chunk 解析和 message plugin。测试是可适配的验收样例，不要求目标项目采用相同目录布局。

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

目标目录不存在时可以复制模板模块；已存在时使用补丁逐项合并，保留目标项目业务代码。测试目标路径不同，只调整导入和宿主文件路径，不削弱关键验收行为。

## 宿主接入点

### TinyRobot Chat

保留现有组件、窗口状态、模型配置和业务 slot，增加以下职责：

- 异步加载 `GenuiProvider`；
- 创建默认关闭的 GenUI 开关；
- 将 schema stream plugin 加入现有 conversation；
- 将自定义 response provider 连接到当前模型 runtime；
- 把 GenUI renderer match 合并到现有 bubble provider；
- 在现有 sender footer 中挂载 `GenuiSwitch`。

模板中可能出现类似接线：

```ts
const providerRuntime = createChatProviderRuntime({
  modelProviders,
  isGenuiEnabled: () => genuiEnabled.value,
  genuiUrl,
  genuiPromptId,
  genuiApiKey,
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

片段刻意没有把 `modelProviders` 同时传入 `useLocalChatRuntime`：在该接线中，自定义 `responseProvider` 是唯一请求所有者，`modelProviders` 只作为 `createChatProviderRuntime` 的输入。合并目标项目现有配置时不要把两个入口叠加。完整决策见 [Runtime 所有权](runtime-ownership.md)。

片段中的 `genuiApiKey` 只允许传入服务合同明确可暴露给浏览器的受限凭据；服务端秘密不得进入该 runtime 参数或任何 `VITE_*` 变量。

模型 runtime 的连接方式必须通过当前 TinyRobot 类型和源码确认。如果该版本需要显式赋值或使用其他公开入口，按实际 API 接入并用测试保护“选中模型与真实请求模型一致”这一行为，不把模板中的某种写法当成跨版本结论。

### Chat UI

在已有 bubble 配置上合并 `contentRenderMode`、`contentResolver` 和 `contentRendererMatches`，保留原来的角色、头像、工具调用和布局配置。没有 GenUI 内容时返回原消息内容。

### 请求 runtime

每次发送时从当前 runtime 取得模型和能力状态。普通分支保留项目既有 endpoint、headers 和模型参数；GenUI 分支只使用 GenUI 服务允许的认证及 prompt 参数。两条分支的请求体都应与界面当前模型一致。

不要复制模板来源以外的模型 ID、供应商偏好、endpoint 或业务 prompt。

## 依赖与配置

目标项目选择 GenUI `1.3.0` 时，可按当前包管理器安装匹配依赖：

```bash
pnpm add @opentiny/genui-sdk-core@1.3.0 @opentiny/genui-sdk-vue@1.3.0 @opentiny/genui-sdk-materials-vue-opentiny-vue@1.3.0
```

其他版本必须按其公开 API 和兼容关系调整。只在 `.env.example` 中加入服务所需的空占位，不修改真实 `.env`。

## 验证

将模板测试复制到项目实际测试目录并调整路径，然后运行项目对应的定向测试、类型检查和生产构建。至少保护：

- 跨 chunk 的文本/schema 顺序；
- sender footer 中的开关接入；
- 当前模型保持；
- 普通/GenUI 请求路由和认证隔离；
- renderer/provider 异步加载。

与模板文件一致只能说明模块未发生差异，不能替代项目构建或运行时验证。修改宿主 runtime 后还要完成不发送消息的本地挂载检查，确认聊天和 GenUI 开关不会触发所有权冲突。遇到依赖、样式或 bundler 错误时，以目标项目的实际错误和包 exports 为依据做最小修复，不把参考项目 workaround 预置到新项目。
