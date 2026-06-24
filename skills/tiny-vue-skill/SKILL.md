---
name: tiny-vue-skill
description: 当使用 TinyVue 组件库(@opentiny/vue)进行开发时或者配置 TinyVue 工程的国际化，主题配置，表单校验说明，自动导入组件等，一定要阅读本技能。本技能提供严格的 API 文档和示例，以及如何查找流程以及代码规范。
license: MIT
metadata:
  author: opentiny
  version: '3.30.0'
---

# TinyVue 组件库开发助手

本技能提供 TinyVue 组件库的完整开发资源，包括组件目录、API 文档、示例代码和工程配置指南，帮助用户**快速生成符合规范的代码**。

- 组件库对应的依赖包为`@opentiny/vue`
- 图标库对应的依赖包为`@opentiny/vue-icon`
- 组件库的样式依赖包为 `@opentiny/vue-theme`
- 组件库的公共逻辑包为 `@opentiny/vue-renderless`
- 组件库的公共函数包为 `@opentiny/utils`
- 组件库的公共 hook 包为 `@opentiny/vue-hooks`
- 组件库的公共指令包为 `@opentiny/vue-directive`
- 组件库的国际化包为： `@opentiny/vue-locale`

## 使用时机

- 使用 TinyVue 组件库开发应用
- 配置项目主题、国际化等工程设置
- 查询组件 API 文档和示例代码
- 编写符合 TinyVue 最佳实践的代码

## 核心组件概览

- **Layout (布局)**: 优先使用该组件进行页面布局。通过嵌套 `Row` (行) 和 `Col` (列) 实现栅格布局。
- **Grid (表格)**: 用于大规模数据的展示、分页、过滤、排序及直接修改。
- **Form (表单)**: 用于数据录入和校验，提供丰富的表单选项, `Form` 和 `FormItem`要配合使用。
- **Input (输入框)**: 用于单行或多行的文本输入。
- **Icon (图标)**: TinyVue 的图标使用方式与业界不同。图标均为**函数**（如 `IconEdit()`），需在组件中执行后方能渲染。

## 目录结构

```
./menu.md      - 所有组件的名称索引和指令名称索引
./webdoc/      - 工程配置文档（安装、引入、i18n、主题等）
./apis/        - 组件 API 文档（属性、事件、插槽、类型）
./demos/       - 组件示例代码源码
./rules/       - 查找和使用规范
```

## 使用方法

根据任务类型，查阅对应的规则文档并严格遵循规范：

| 规则文档                                    | 适用场景                                           |
| ------------------------------------------- | -------------------------------------------------- |
| [project-setting](rules/project-setting.md) | 安装 TinyVue、引入组件、配置国际化、主题、深色模式 |
| [component-use](rules/component-use.md)     | 查找组件 API 文档和示例代码源码， 查找指令的示例代码    |

## 重要约束

- 严格遵循工程文档和组件 API 规范
- 严禁使用其他开源库信息猜测 TinyVue 组件用法
- 查找组件信息必须按顺序进行：组件名 → API 文档 → 示例代码
- 在 Vue 的模板中引用组件时，组件名前缀使用 `tiny-`， 比如 `<tiny-button> </tiny-button>`
- 不要使用业务组件
