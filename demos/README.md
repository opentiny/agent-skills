# tiny-vue-skill-demo

TinyVue 组件库与 AI 协作能力的演示项目，包含三个独立 Demo，分别展示无障碍（A11y）、MCP 协议集成和 Skill 语义连接层的核心能力。

## Demo 简介

### demoA11y — TinyVue 无障碍对比

对比 TinyVue 组件与原生 HTML 在无障碍方面的真实差异。同一个成员登记表单，变量只有组件库选择：

- **TinyVue 版本**：组件内置 `aria-label`、`aria-expanded`、焦点环和键盘导航，A11y 评分 96/100，零额外代码
- **原生 HTML 版本**：`div + span` 堆砌，无 ARIA、无焦点管理、键盘体验差，A11y 评分 38/100
- **10 项维度对比清单**：逐条对比 aria 属性、label 关联、键盘导航、焦点可视、状态播报等关键差异
- **AI 操作界面优势**：展示无障碍属性如何让 AI（LLM / MCP）更精准地操控界面——无障碍不仅是给人用的，也是给 AI 用的

**技术栈**：Vue 3 + Vite + TinyVue + TailwindCSS

```bash
cd demoA11y && pnpm install && pnpm dev
```

---

### demoMcp — TinyVue + MCP 协议集成

展示 TinyVue 组件库与 MCP（Model Context Protocol）协议的真实集成。这不是模拟，是真实的 MCP Server 调用：

- **左端 MCP Client 终端**：展示完整的 JSON-RPC 协议交互，包括 `initialize`、`tools/list`、`resources/list` 和工具调用全流程
- **LLM 中间层**：自然语言指令 → LLM 决策（function calling）→ MCP 工具调用 → TinyVue 渲染，全程可追踪
- **右端 TinyVue 渲染端**：MCP 工具返回 Schema 后，TinyVue 组件按 Schema 配置自动渲染表单画布
- **3 个预设场景**：活动报名表单、采购审批表单、产品反馈表单，每个场景包含完整的字段 Schema 和校验规则
- **MCP Server 注册 4 个工具**：`form.createPage`、`form.addField`、`form.setValidation`、`form.previewRender`

**技术栈**：Vue 3 + Vite + TinyVue + MCP SDK (Streamable HTTP) + Express + LLM API (DeepSeek/OpenAI 兼容) + TailwindCSS

```bash
cd demoMcp && pnpm install
# 需要在 server/.env 中配置 LLM_API_KEY
pnpm dev:all   # 同时启动前端和 MCP Server
```

---

### demoSkill — tiny-vue-skill 演示中心

展示 tiny-vue-skill 如何将 TinyVue 的组件 API、典型用法、代码约束和业务场景转化为 AI 可调用的 Skill：

- **Skill 核心概念**：组件 API 语义索引、TinyVue 用法深度链接、跨 IDE Skill 分发、说出需求即出代码
- **工作流程演示**：需求输入 → Skill 检索 → 代码生成 → 开发者微调，4 步闭环
- **示例需求与代码生成**：3 个预设 Prompt（Grid 表格、多选批量操作、空态加载态），点击即可查看 Skill 生成的完整 SFC 代码
- **SkillGridDemo 组件**：展示 AI 基于 tiny-vue-skill 生成的 TinyVue Grid 实际渲染效果，包含状态标签、操作按钮、分页搜索

**技术栈**：Vue 3 + Vite + TinyVue + TailwindCSS

```bash
cd demoSkill && pnpm install && pnpm dev
```

---

## 项目结构

```
tiny-vue-skill-demo/
├── demoA11y/          # 无障碍对比 Demo
│   ├── App.vue        # 主页面（对比 TinyVue vs 原生 HTML）
│   ├── main.ts
│   ├── package.json
│   └── vite.config.ts
├── demoMcp/           # MCP 协议集成 Demo
│   ├── server/        # MCP Server + LLM 中间层
│   │   ├── index.ts         # Express 服务入口
│   │   ├── mcp-server.ts    # MCP 工具与 Resource 注册
│   │   └── llm.ts           # LLM function calling 对话流程
│   ├── src/           # 前端
│   │   ├── api/mcp.ts       # MCP Client API（Streamable HTTP）
│   │   ├── App.vue          # 双栏展示（MCP 终端 + TinyVue 渲染）
│   │   └── main.ts
│   └── package.json
├── demoSkill/         # Skill 演示中心
│   ├── src/
│   │   ├── components/SkillGridDemo.vue   # Grid 组件渲染
│   │   ├── data/skillDemo.ts              # Skill 特性与示例数据
│   │   ├── App.vue                        # 主页面
│   │   └── main.ts
│   └── package.json
└── README.md
```

## 三个 Demo 的关系

| 维度 | demoA11y | demoMcp | demoSkill |
|------|----------|---------|-----------|
| 核心主题 | 无障碍能力 | AI 协议集成 | Skill 语义连接 |
| AI 关系 | A11y 是 AI 操控界面的基础设施 | MCP 是 AI 调用组件的协议通道 | Skill 是 AI 理解组件的知识层 |
| 技术重点 | ARIA / 焦点管理 / 键盘导航 | MCP SDK / JSON-RPC / LLM function calling | Skill 检索 / Prompt → Code |
| 运行依赖 | 仅前端 | 前端 + MCP Server + LLM API | 仅前端 |
