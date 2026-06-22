import express from 'express'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { mcp, scenarios } from './mcp-server.js'
import { runLLMWithMCP } from './llm.js'
import type { LLMStep } from './llm.js'

const app = express()
app.use(express.json())

// 创建 Streamable HTTP 传输实例（SSE 模式）
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined
})

// 连接 MCP Server 到传输层
await mcp.connect(transport)

// ========== MCP Streamable HTTP endpoint ==========
app.post('/mcp', async (req, res) => {
  await transport.handleRequest(req, res, req.body)
})

app.get('/mcp', async (req, res) => {
  await transport.handleRequest(req, res)
})

app.delete('/mcp', async (req, res) => {
  await transport.handleRequest(req, res)
})

// ========== LLM + MCP 对话 endpoint ==========
// 前端发送自然语言 → LLM 决策调用哪些 MCP 工具 → 执行工具 → 返回完整交互过程

app.post('/chat', async (req, res) => {
  const { prompt } = req.body as { prompt: string }

  if (!prompt) {
    res.status(400).json({ error: '缺少 prompt 参数' })
    return
  }

  try {
    // 从 MCP Server 获取注册的工具列表
    const mcpTools = [
      {
        name: 'form.createPage',
        description: '创建表单页面容器，设置标题、说明、版本与页面标签。',
        inputSchema: {
          type: 'object',
          properties: {
            scenarioId: { type: 'string', description: '场景 ID: event / approval / feedback' }
          },
          required: ['scenarioId']
        }
      },
      {
        name: 'form.addField',
        description: '按 Schema 添加输入、选择、日期、多选等字段组件到表单。',
        inputSchema: {
          type: 'object',
          properties: {
            scenarioId: { type: 'string', description: '场景 ID: event / approval / feedback' }
          },
          required: ['scenarioId']
        }
      },
      {
        name: 'form.setValidation',
        description: '为字段批量配置必填、提示语和提交前校验策略。',
        inputSchema: {
          type: 'object',
          properties: {
            scenarioId: { type: 'string', description: '场景 ID: event / approval / feedback' }
          },
          required: ['scenarioId']
        }
      },
      {
        name: 'form.previewRender',
        description: '刷新低代码画布，并同步右侧 Schema JSON 与属性面板。',
        inputSchema: {
          type: 'object',
          properties: {
            scenarioId: { type: 'string', description: '场景 ID: event / approval / feedback' }
          },
          required: ['scenarioId']
        }
      }
    ]

    // 执行 MCP 工具的回调函数
    // 这里直接调用 mcp-server 中的场景数据（与 MCP 工具逻辑一致）
    const executeTool = async (toolName: string, args: Record<string, unknown>) => {
      const scenarioId = args.scenarioId as string
      const scenario = scenarios[scenarioId]

      if (!scenario) {
        return { content: [{ type: 'text', text: `错误：未找到场景 "${scenarioId}"` }] }
      }

      switch (toolName) {
        case 'form.createPage': {
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
        case 'form.addField': {
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
        case 'form.setValidation': {
          const validations = scenario.schema.fields.map(f => ({ id: f.id, required: f.required, helper: f.helper }))
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
        case 'form.previewRender': {
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
        default:
          return { content: [{ type: 'text', text: `未知工具: ${toolName}` }] }
      }
    }

    // 执行 LLM + MCP 完整对话流程
    const result = await runLLMWithMCP(prompt, mcpTools, executeTool)

    res.json({
      success: true,
      finalMessage: result.finalMessage,
      steps: result.steps
    })
  } catch (error: any) {
    console.error('LLM chat error:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      steps: []
    })
  }
})

// ========== 健康检查 ==========
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'mcp-form-builder' })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`MCP Server running on http://localhost:${PORT}`)
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`)
  console.log(`LLM Chat endpoint: http://localhost:${PORT}/chat`)
  console.log(`Health check: http://localhost:${PORT}/health`)
})
