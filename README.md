# SKILLS 集合

本仓库包含使用OpenTiny各产品开发相关的技能工具。

## 安装使用

### 方式一：通过 Claude Code Skills Market 添加（Claude Code用户推荐）

使用 Claude Code 内置的插件市场功能，可以快速安装 OpenTiny 技能。

```bash
# 启动claude code后添加市场及插件，也可以执行/plugin后在界面交互式添加及管理
/plugin marketplace add https://github.com/opentiny/opentiny-agent-skills
/plugin install tiny-vue-skill@opentiny-skills

# 或者在未启动状态可以执行下面命令添加市场及插件
claude plugin marketplace add https://github.com/opentiny/opentiny-agent-skills
claude plugin install tiny-vue-skill@opentiny-skills
```

### 方式二：使用 `skills` 工具安装

`skills` 是 vercel-labs 提供的一个npm 工具命令，辅助我们安装skill到本地环境上，详细内容请参见其[README.md](https://github.com/vercel-labs/skills)。 它支持列出 github 仓库中的 skills, 以及自动安装到用户工程或用户全局的位置。

```bash
  # 列出所有的可能技能
  npx skills add opentiny/agent-skills --list

  # 全局安装 tiny-vue-skill， 支持 claude-code/vs code
  npx skills add opentiny/agent-skills -g --skill tiny-vue-skill --agent claude-code

  # 项目级安装 tiny-vue-skill， 支持 claude-code/vs code
  npx skills add opentiny/agent-skills --skill tiny-vue-skill --agent claude-code

```

### 方式三：克隆复制式使用

1. 克隆仓库到本地，然后将`skills` 文件夹复制到用户工程或都用户全局配置的指定路径中,具体位置请参考各IDE/CLI 的官方文档。以下为部分工具的安装位置：

<!-- available-agents:start -->

| Agent          | `--agent`        | 项目内路径          | 全局路径                        |
| -------------- | ---------------- | ------------------- | ------------------------------- |
| Amp            | `amp`            | `.agents/skills/`   | `~/.config/agents/skills/`      |
| Antigravity    | `antigravity`    | `.agent/skills/`    | `~/.gemini/antigravity/skills/` |
| Claude Code    | `claude-code`    | `.claude/skills/`   | `~/.claude/skills/`             |
| Clawdbot       | `clawdbot`       | `skills/`           | `~/.clawdbot/skills/`           |
| Codex          | `codex`          | `.codex/skills/`    | `~/.codex/skills/`              |
| Cursor         | `cursor`         | `.cursor/skills/`   | `~/.cursor/skills/`             |
| Droid          | `droid`          | `.factory/skills/`  | `~/.factory/skills/`            |
| Gemini CLI     | `gemini-cli`     | `.gemini/skills/`   | `~/.gemini/skills/`             |
| GitHub Copilot | `github-copilot` | `.github/skills/`   | `~/.copilot/skills/`            |
| Goose          | `goose`          | `.goose/skills/`    | `~/.config/goose/skills/`       |
| Kilo Code      | `kilo`           | `.kilocode/skills/` | `~/.kilocode/skills/`           |
| Kiro CLI       | `kiro-cli`       | `.kiro/skills/`     | `~/.kiro/skills/`               |
| OpenCode       | `opencode`       | `.opencode/skills/` | `~/.config/opencode/skills/`    |
| Roo Code       | `roo`            | `.roo/skills/`      | `~/.roo/skills/`                |
| Trae           | `trae`           | `.trae/skills/`     | `~/.trae/skills/`               |
| Windsurf       | `windsurf`       | `.windsurf/skills/` | `~/.codeium/windsurf/skills/`   |

<!-- available-agents:end -->

### 方式四：使用 `npx` 命令安装（目前只支持下载tiny-vue-skill）

```bash
  npx --yes git+https://github.com/opentiny/agent-skills.git
```
>安装限制
> ·`npx` 的方式依赖 `NodeJS`环境（推荐 `Node 22+` 以上 `LTS` 版本）
>
#### 安装后效果
```bash
  ~/.config/opencode/skills/tiny-vue-skill
```

> **IMPORTANT**: 不同的AI IDE/CLI， 对skill的配置可能不同，请严格参考其文档进行配置路径。

> **IMPORTANT**: TinyVue组件也会定期升级，需要重新复制或重新执行 skills add 命令来更新Skill 。

> **通过市场安装的优势**: 使用 `claude plugin marketplace` 安装后，可以使用 `claude plugin update` 命令轻松更新技能。

## 在 vscode 中启用skill

按快捷键 `ctrl + ,` 打开设置界面，搜索 `useagentskills` 会看到实验性支持`Use Agent Skills`功能， 勾选启用即可。

## 同步最新的TinyVue文档/示例

随着TinyVue的不断开发，此仓库的Skill资源肯定会落后于主仓库。需要同步时，手工执行一下”同步TinyVue仓库“的Github Action即可！

## 维护 TinyRobot 1.0 Skill

`skills/tiny-robot-skill` 只服务使用 TinyRobot 构建应用的开发者，知识快照默认来自 TinyRobot 的 `release/v1.0.x`。

以下内容由同步器生成，不应手工编辑：

- `component-index.json`
- `references/docs/`（包括 `.snapshot.json`）
- `examples/demos/`

`SKILL.md`、`install-config.json`、`references/` 下除 `references/docs/` 外的决策文档、`agents/` 和 `.claude-plugin/` 是手工维护内容。同步器只重建生成区，不覆盖这些文件。

本地同步前先检出 TinyRobot 源码并取得目标提交 SHA，然后在本仓库执行：

```bash
pnpm --dir scripts install --frozen-lockfile
pnpm --dir scripts tiny-robot-skill-sync -- \
  --source-root ../../tiny-robot \
  --skill-root ../skills/tiny-robot-skill \
  --source-ref release/v1.0.x \
  --source-commit <tiny-robot-commit>
pnpm --dir scripts validate:tiny-robot-skill
```

GitHub Actions 中的 `Sync TinyRobot docs into skills` 支持通过 `source_ref` 选择分支、标签或提交；工作流会记录实际提交、生成快照、完整校验后再提交。

版本职责彼此独立：Skill 发布版本由 `SKILL.md`、插件和市场元数据共同维护；TinyRobot 兼容范围与源提交记录在 `component-index.json` 和 `.snapshot.json`；应用实际可用 API 以消费项目的安装版本和公开类型声明为准。

## 如何添加新的 Skill

本仓库采用 Claude Code Plugin Marketplace 规范结构，添加新技能需要以下步骤：

### 1. 创建技能目录结构

在 `skills/` 目录下创建新的技能目录：

```bash
mkdir -p skills/your-skill-name/.claude-plugin
```

### 2. 创建插件配置文件

在 `skills/your-skill-name/.claude-plugin/plugin.json` 中定义插件元数据：

```json
{
  "name": "your-skill-name",
  "description": "技能的简短描述",
  "version": "1.0.0",
  "author": {
    "name": "OpenTiny"
  },
  "license": "MIT"
}
```

### 3. 创建技能定义文件

在 `skills/your-skill-name/SKILL.md` 中定义技能：

```markdown
---
name: your-skill-name
description: 技能的详细描述
license: MIT
metadata:
  author: OpenTiny
  version: '1.0.0'
---

# 技能说明

这里是技能的详细使用说明...
```

之后可以按需添加其他的技能文档或者脚本等

### 4. 更新市场配置

在 `.claude-plugin/marketplace.json` 的 `plugins` 数组中添加新技能：

```json
{
  "name": "your-skill-name",
  "source": "./skills/your-skill-name",
  "description": "技能的简短描述",
  "version": "1.0.0",
  "author": {
    "name": "OpenTiny"
  },
  "license": "MIT",
  "tags": ["tag1", "tag2"],
  "keywords": ["keyword1", "keyword2"]
}
```

### 目录结构示例

```
skills/
├── your-skill-name/
│   ├── .claude-plugin/
│   │   └── plugin.json          # 插件元数据
│   └── SKILL.md                 # 技能定义文件
└── tiny-vue-skill/              # 现有技能
    └── ...
```

### 注意事项

- 技能名称使用 kebab-case（小写字母和连字符）
- 语义化版本号遵循 SemVer 规范
- 更新版本后记得同步修改 `plugin.json` 和 `marketplace.json`

## 使用示例

使用以下语句测试：

1. 在test目录中，新建一个vue工程，然后安装TinyVue组件，使用Grid组件开发一个中国省级信息查询的表格，要求有：序号，省名，人口，面积，GDP等信息，这些信息要支持排序的功能，省名的列要冻结在最左边。 表格的顶部有过滤查询省名的功能。

2. 为当前TinyVue的工程增加深色模式的能力

