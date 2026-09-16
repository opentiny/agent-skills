# TinyRobot Chat 接入

本参考用于在现有 Vue 3 + Vite 应用中引入或确认 TinyRobot Chat。

## 接入前检查

先确认：

- 当前目录是目标应用，而不是仅包含它的父目录；
- `package.json`、应用入口、Vite 配置和当前 lockfile 的位置；
- Git/workspace 边界和已有修改；
- 项目使用的包管理器；
- 是否已有 TinyRobot 组件、依赖、样式和挂载链。

若安装命令可能修改其他 workspace 成员、共享 lockfile 的归属不清楚，或生成器将覆盖用户已有改动，先停止并说明冲突。不要用忽略 workspace 的参数掩盖边界问题。

## 使用 CLI

若项目已经存在真实 TinyRobot 接入，不重复运行生成器。否则在目标应用目录执行与包管理器对应的命令。`0.5.2-alpha.15` 是本 Skill 当前锁定的已发布生成器版本。先查看完整变更计划：

```bash
pnpm dlx @opentiny/tiny-robot-cli@0.5.2-alpha.15 add chat --dry-run
npx @opentiny/tiny-robot-cli@0.5.2-alpha.15 add chat --dry-run
```

只执行与项目包管理器对应的一条。确认计划中的目标 package、冲突、依赖、样式入口、`.env.example` 和 `App.vue` 挂载均符合当前应用后，再执行对应命令：

```bash
pnpm dlx @opentiny/tiny-robot-cli@0.5.2-alpha.15 add chat --yes
npx @opentiny/tiny-robot-cli@0.5.2-alpha.15 add chat --yes
```

使用 `add chat`，不使用 `create`，也不改用未发布的本地 CLI。默认行为会在能安全解析 `src/App.vue` 时自动导入并挂载 `TinyRobotChat`；现有挂载链不应由生成器修改时，在预览和执行命令中都增加 `--no-mount`，再按命令输出的片段手动接入。交互式人工选择可以省略 `--yes`；Agent 执行时保留先 `--dry-run`、后 `--yes` 的两步检查。

`0.5.2-alpha.15` 的 `add chat` 会：

- 把组件、配置、composable 和样式写入 `src/tiny-robot-chat/`；
- 向 `src/main.ts` 或 `src/main.js` 添加 TinyRobot 包样式和 `./tiny-robot-chat/index.css`；
- 合并 `.env.example`，但不创建或修改 `.env`；
- 更新 `package.json`，但不安装依赖、不修改 lockfile，也不修改 `vite.config.*`；
- 对不同内容的同名文件报告冲突，并允许重复执行已完成的相同变更。

当前已发布的 `0.5.2-alpha.15` 仍需两项生成后适配：

1. 将直接依赖 `@vueuse/core` 对齐为 `13.9.0`，随后用项目包管理器更新 lockfile；已有可满足 `13.9.0` 的兼容范围或更高版本时保留原声明。
2. 检查 `src/tiny-robot-chat/index.css`，不要把其中的 `:root`、裸 `*`、`html`、`body`、`#app` 或 `body { overflow: hidden }` 作为宿主全局规则保留；将 Chat 所需的字体、颜色和 `box-sizing` 收窄到 `.chat-add-app`、`.chat-add-window` 及其后代。业务应用的尺寸、边距和滚动仍由宿主样式负责。

## 生成后默认适配

CLI 输出是可运行起点，不代表目标应用已经满足交互验收。没有用户、设计稿或现有产品规范覆盖时，采用以下通用默认；存在明确要求时以目标要求为准：

- 悬浮窗宽度为 `500px`，高度跟随当前视口，`placement` 使用 `top-right`，右侧和顶部偏移均为 `0`；视口高度变化时同步更新浮窗高度。
- 启动按钮使用白色背景和品牌主色图标，hover 背景使用浅灰色；保留可见的键盘焦点态。
- `.chat-add-app` 作为覆盖层时使用 `pointer-events: none`，只对实际按钮和窗口恢复 `pointer-events: auto`，避免透明覆盖层阻断宿主页面或让 Chat 控件不可点击。
- `TrThemeProvider` 的主题目标收窄到 Chat 宿主，例如 `target-element=".chat-add-app"`；不要为了修复主题或布局创建第二个 Chat 外壳。
- AI 消息默认允许占满聊天内容区，并为连续的文本、工具结果或 GenUI 内容块保留适度间距；只收窄到 assistant 消息，不改变用户消息气泡。
- 不自行增加配置提示、Toast、模拟回复或说明文案。只有目标产品明确要求时才显示这些内容。

```css
.chat-add-window [data-role='assistant'] {
  --tr-bubble-max-width: 100%;

  > * + * {
    margin-top: 8px;
  }
}
```

在 `0.5.2-alpha.15` 的 `useWindow` 状态中，默认浮窗可按下面的形状初始化；保持生成器已有的拖拽、缩放和全屏切换能力：

```ts
const { height } = useWindowSize()
const floatingState = shallowRef<LayoutFloatingState>({
  placement: 'top-right',
  offsetX: 0,
  offsetY: 0,
  width: 500,
  height: height.value,
})
```

模型发送能力必须来自实际认证合同。浏览器直连 provider 只有 API Key 存在时才属于已配置；自定义 `apiUrl` 只是端点，不是凭据，不能单独启用发送。同源代理或服务端认证只有在项目已有合同明确说明无需浏览器 Key 时才能例外。把同一判定用于传给 runtime 的 provider 列表和 composer 的 `submitDisabled`，不要只禁用视觉按钮而保留其他发送入口。

若产品要求“点击新会话只显示空白态，首条有效消息才产生历史记录”，不要直接把按钮绑定到基础 runtime 的 `createConversation()`。复制或适配 [延迟会话 runtime 适配器](../assets/tinyrobot-chat-0.5.2-alpha.15/useDeferredConversationRuntime.ts)，用包装后的 runtime 提供给 `TrChat`，并在基础 runtime 的 `beforeSend` 中提交真实创建：

```ts
const deferredConversation = useDeferredConversationRuntime()
let baseRuntime: ChatRuntime
baseRuntime = useLocalChatRuntime({
  modelProviders: configuredModelProviders,
  composer: { submitDisabled },
  beforeSend: () => deferredConversation.commit(() => baseRuntime.actions.createConversation()),
})
const runtime = deferredConversation.wrap(baseRuntime)
```

该版本会在空白文本、composer disabled 和 `submitDisabled` 检查之后调用 `beforeSend`，因此无效发送不会创建空会话。切换历史会话必须退出空白态。若目标版本、runtime 所有者或 `beforeSend` 顺序不同，先检查安装包源码和类型，再适配或停止，不照搬此模板。

在 CLI 交互中保留现有业务文件和真实环境配置。如果生成器计划写入 `.env` 或覆盖已有文件，而交互中无法安全取消该项，则取消操作并报告原因，不要先覆盖再清理。

CLI 或依赖安装非零退出即表示该步骤未完成。保留原始错误，按当前包管理器和项目配置诊断，不预置某个包、某个 pnpm 版本或某条忽略脚本命令的通用绕过方案。

## 代码接入检查

生成后或复用已有实现时，确认以下事实：

1. `package.json` 和对应 lockfile 能解析到实际使用的 TinyRobot 包；
2. 聊天组件从当前安装包的有效导出路径使用 `TrThemeProvider` 和 `TrChat`，或使用该版本公开的等价 API；
3. 从真实应用入口可以追踪到 `src/tiny-robot-chat/TinyRobotChat.vue`，且没有第二个聊天壳；
4. TinyRobot 包样式和 `src/tiny-robot-chat/index.css` 从应用入口或等价的全局样式入口加载，Chat 样式不重置宿主文档；
5. 默认浮窗、启动按钮、点击区域和主题目标符合本参考或目标产品的明确覆盖；
6. 已有模型配置、窗口状态和业务布局没有被无关重写；浏览器直连 provider 不会仅因配置了 URL 就启用发送；
7. 新会话是否立即创建由目标交互合同决定；要求延迟创建时，重复点击不会增加空历史记录。

同名文件或字符串命中只能帮助定位，不能代替以上检查。基础接入不完整时先修复 TinyRobot，不用 mock 对话框、脚本卡片或自制聊天壳继续后续阶段。

## 配置

保留项目现有模型变量及语义。只在 `.env.example` 中补充当前接入确实需要的空占位，不读取或修改真实 `.env`。

模型凭据缺失不阻塞代码接入，也不构成发送真实消息的授权。

## 验证

默认运行与接入有关的源码测试、类型检查和生产构建。最终说明：

- TinyRobot 的依赖、导入、挂载和样式是否完整；
- CLI 或安装是否有未解决错误；
- 构建是否通过及其警告；
- 哪些运行配置仍待开发者补充。

只有用户明确要求验证对话时，才启动应用并对用户指定的模型完成发送消息、收到有效回复的闭环。页面显示聊天框、请求已经发出或本地 mock 返回都不能代替真实回复。
