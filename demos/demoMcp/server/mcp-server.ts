import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

const mcp = new McpServer({
  name: 'mcp-form-builder',
  version: '1.0.0'
})

// ========== 类型定义 ==========

type FieldType = 'input' | 'textarea' | 'select' | 'date' | 'radio' | 'checkbox'

interface FormField {
  id: string
  label: string
  type: FieldType
  placeholder: string
  required: boolean
  helper: string
  options?: string[]
  span?: 1 | 2
}

interface FormSchema {
  title: string
  description: string
  version: string
  tags: string[]
  fields: FormField[]
}

interface Scenario {
  id: string
  name: string
  prompt: string
  schema: FormSchema
}

// ========== 场景数据 ==========

const scenarios: Record<string, Scenario> = {
  event: {
    id: 'event',
    name: '活动报名表单',
    prompt: '帮我搭建一个活动报名页，收集姓名、部门、手机号、参与日期和兴趣方向。',
    schema: {
      title: 'AI 共创活动报名表',
      description: '面向内部员工的活动报名表单，支持基本信息采集、日期选择、兴趣标签与备注说明。',
      version: 'v1.4.0',
      tags: ['活动运营', '报名收集', '自动校验'],
      fields: [
        { id: 'name', label: '姓名', type: 'input', placeholder: '请输入真实姓名', required: true, helper: 'MCP 添加 input 组件并绑定必填校验' },
        { id: 'department', label: '所属部门', type: 'select', placeholder: '请选择部门', required: true, helper: '从组织字段模板中生成部门选择器', options: ['产品中心', '技术中心', '设计中心', '运营中心'] },
        { id: 'phone', label: '手机号', type: 'input', placeholder: '请输入 11 位手机号', required: true, helper: '自动配置手机号格式提示' },
        { id: 'joinDate', label: '参与日期', type: 'date', placeholder: '选择参与日期', required: true, helper: '使用日期组件限制用户输入格式' },
        { id: 'interests', label: '兴趣方向', type: 'checkbox', placeholder: '请选择兴趣方向', required: false, helper: '支持多选标签，用于后续分组运营', options: ['AI 工具', '低代码', '体验设计', '工程效率'], span: 2 },
        { id: 'remark', label: '备注说明', type: 'textarea', placeholder: '可填写特殊需求或建议', required: false, helper: '长文本组件用于补充信息', span: 2 }
      ]
    }
  },
  approval: {
    id: 'approval',
    name: '采购审批表单',
    prompt: '创建一个采购审批表，包含采购类型、预算金额、期望到货时间和审批说明。',
    schema: {
      title: '智能采购审批申请',
      description: '用于团队采购事项的标准化申请表，AI 自动配置审批所需字段与必填规则。',
      version: 'v2.1.2',
      tags: ['审批流', '采购管理', '预算管控'],
      fields: [
        { id: 'applicant', label: '申请人', type: 'input', placeholder: '请输入申请人姓名', required: true, helper: '自动识别为人员信息字段' },
        { id: 'purchaseType', label: '采购类型', type: 'select', placeholder: '请选择采购类型', required: true, helper: 'MCP 调用组件工具生成枚举选项', options: ['办公用品', '软件服务', '硬件设备', '外包服务'] },
        { id: 'budget', label: '预算金额', type: 'input', placeholder: '请输入预算金额，例如 12000', required: true, helper: '自动添加金额格式提示' },
        { id: 'arrivalDate', label: '期望到货时间', type: 'date', placeholder: '选择期望日期', required: true, helper: '日期字段用于驱动后续 SLA 提醒' },
        { id: 'urgency', label: '紧急程度', type: 'radio', placeholder: '请选择紧急程度', required: true, helper: 'AI 根据审批场景补充紧急程度字段', options: ['普通', '加急', '特急'], span: 2 },
        { id: 'reason', label: '采购说明', type: 'textarea', placeholder: '请说明采购背景、用途与收益', required: true, helper: '文本域组件承载审批说明', span: 2 }
      ]
    }
  },
  feedback: {
    id: 'feedback',
    name: '产品反馈表单',
    prompt: '生成一个产品反馈收集页，支持选择问题类型、影响范围、满意度和详细描述。',
    schema: {
      title: '产品体验反馈收集',
      description: '收集用户对产品功能、体验与稳定性的反馈，并通过结构化字段提升后续分析效率。',
      version: 'v3.0.5',
      tags: ['用户反馈', '体验洞察', '问题分类'],
      fields: [
        { id: 'userName', label: '反馈人', type: 'input', placeholder: '请输入反馈人', required: true, helper: '人员字段可与登录态联动自动填充' },
        { id: 'issueType', label: '问题类型', type: 'select', placeholder: '请选择问题类型', required: true, helper: 'AI 生成产品反馈常见分类', options: ['功能建议', '体验问题', '性能问题', '数据异常'] },
        { id: 'scope', label: '影响范围', type: 'radio', placeholder: '请选择影响范围', required: true, helper: '单选组件用于快速判断优先级', options: ['仅我遇到', '小范围用户', '大量用户'] },
        { id: 'satisfaction', label: '当前满意度', type: 'select', placeholder: '请选择满意度', required: false, helper: '结构化沉淀体验趋势', options: ['非常满意', '基本满意', '一般', '不满意'] },
        { id: 'modules', label: '涉及模块', type: 'checkbox', placeholder: '请选择涉及模块', required: false, helper: '多选模块便于分派责任团队', options: ['首页', '搜索', '表单', '报表', '权限'], span: 2 },
        { id: 'detail', label: '详细描述', type: 'textarea', placeholder: '请描述现象、复现路径和期望结果', required: true, helper: 'AI 自动把描述字段设为跨列布局', span: 2 }
      ]
    }
  }
}

// ========== MCP 工具注册 ==========

// 使用 mcp.tool(name, description, inputSchema, callback) 签名
// inputSchema 是 Zod raw shape 对象（如 { scenarioId: z.string() }）

mcp.tool(
  'form.createPage',
  '创建表单页面容器，设置标题、说明、版本与页面标签。',
  { scenarioId: z.string().describe('场景 ID: event / approval / feedback') },
  async ({ scenarioId }) => {
    const scenario = scenarios[scenarioId]
    if (!scenario) {
      return { content: [{ type: 'text', text: `错误：未找到场景 "${scenarioId}"` }] }
    }
    const { title, description, version, tags } = scenario.schema
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          action: 'createPage',
          data: { title, description, version, tags },
          message: `MCP 工具 form.createPage 已创建表单页面「${title}」`
        })
      }]
    }
  }
)

mcp.tool(
  'form.addField',
  '按 Schema 添加输入、选择、日期、多选等字段组件到表单。',
  { scenarioId: z.string().describe('场景 ID: event / approval / feedback') },
  async ({ scenarioId }) => {
    const scenario = scenarios[scenarioId]
    if (!scenario) {
      return { content: [{ type: 'text', text: `错误：未找到场景 "${scenarioId}"` }] }
    }
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          action: 'addField',
          data: scenario.schema.fields,
          message: `MCP 工具 form.addField 已添加 ${scenario.schema.fields.length} 个字段组件`
        })
      }]
    }
  }
)

mcp.tool(
  'form.setValidation',
  '为字段批量配置必填、提示语和提交前校验策略。',
  { scenarioId: z.string().describe('场景 ID: event / approval / feedback') },
  async ({ scenarioId }) => {
    const scenario = scenarios[scenarioId]
    if (!scenario) {
      return { content: [{ type: 'text', text: `错误：未找到场景 "${scenarioId}"` }] }
    }
    const validations = scenario.schema.fields.map(f => ({
      id: f.id,
      required: f.required,
      helper: f.helper
    }))
    const requiredCount = scenario.schema.fields.filter(f => f.required).length
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          action: 'setValidation',
          data: validations,
          message: `MCP 工具 form.setValidation 已配置 ${requiredCount} 个必填校验规则`
        })
      }]
    }
  }
)

mcp.tool(
  'form.previewRender',
  '刷新低代码画布，并同步右侧 Schema JSON 与属性面板。',
  { scenarioId: z.string().describe('场景 ID: event / approval / feedback') },
  async ({ scenarioId }) => {
    const scenario = scenarios[scenarioId]
    if (!scenario) {
      return { content: [{ type: 'text', text: `错误：未找到场景 "${scenarioId}"` }] }
    }
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          action: 'previewRender',
          data: scenario.schema,
          message: `MCP 工具 form.previewRender 已刷新画布，渲染「${scenario.schema.title}」完整表单`
        })
      }]
    }
  }
)

// ========== MCP Resource 注册 ==========

mcp.resource(
  '可用场景列表',
  'mcp://form-builder/scenarios',
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: 'application/json',
      text: JSON.stringify(Object.values(scenarios).map(s => ({
        id: s.id,
        name: s.name,
        prompt: s.prompt
      })))
    }]
  })
)

mcp.resource(
  'MCP 工具清单',
  'mcp://form-builder/tools',
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: 'application/json',
      text: JSON.stringify([
        { name: 'form.createPage', description: '创建表单页面容器，设置标题、说明、版本与页面标签。' },
        { name: 'form.addField', description: '按 Schema 添加输入、选择、日期、多选等字段组件。' },
        { name: 'form.setValidation', description: '为字段批量配置必填、提示语和提交前校验策略。' },
        { name: 'form.previewRender', description: '刷新低代码画布，并同步右侧 Schema JSON 与属性面板。' }
      ])
    }]
  })
)

export { mcp, scenarios }
export type { FormSchema, FormField, Scenario, FieldType }
