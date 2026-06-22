/**
 * LLM 中间层
 * 调用 OpenAI 兼容 API，使用 function calling 自动决策调用 MCP 工具
 *
 * 核心流程：
 * 1. 前端发送自然语言指令
 * 2. 后端调用 LLM，附带 MCP Server 注册的 tools schema
 * 3. LLM 返回 tool_calls（决定调用哪些 MCP 工具）
 * 4. 后端执行 MCP 工具调用，将结果返回给 LLM
 * 5. LLM 根据工具结果继续决策或返回最终结果
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '.env') })

const LLM_BASE_URL = process.env.LLM_BASE_URL || 'https://api.deepseek.com/v1'
const LLM_API_KEY = process.env.LLM_API_KEY || ''
const LLM_MODEL = process.env.LLM_MODEL || 'deepseek-chat'

/** 调试：验证环境变量是否正确加载 */
if (!LLM_API_KEY) {
  console.warn('[LLM] ⚠️ LLM_API_KEY 未设置，请检查 server/.env 文件')
} else {
  console.log(`[LLM] ✅ 配置已加载: BASE_URL=${LLM_BASE_URL}, MODEL=${LLM_MODEL}, KEY=${LLM_API_KEY.slice(0, 8)}...`)
}

/** LLM 对话消息 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | null
  tool_calls?: Array<{
    id: string
    type: 'function'
    function: { name: string; arguments: string }
  }>
  tool_call_id?: string
}

/** LLM 工具定义（OpenAI function calling 格式） */
export interface LLMTool {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, unknown>
      required: string[]
    }
  }
}

/** 单步交互记录 */
export interface LLMStep {
  type: 'llm_request' | 'llm_response' | 'tool_call' | 'tool_result'
  data: unknown
  timestamp: string
}

/**
 * 调用 LLM Chat Completions API
 */
async function callLLM(
  messages: ChatMessage[],
  tools: LLMTool[],
  toolChoice: 'auto' | 'required' = 'auto'
): Promise<{
  message: ChatMessage
  finish_reason: string
}> {
  const response = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      tools: tools.length > 0 ? tools : undefined,
      tool_choice: tools.length > 0 ? toolChoice : undefined,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`LLM API error ${response.status}: ${errText}`)
  }

  const data = await response.json()
  const choice = data.choices?.[0]
  if (!choice) throw new Error('LLM 返回空结果')

  return {
    message: choice.message,
    finish_reason: choice.finish_reason
  }
}

/**
 * 执行 LLM + MCP 工具调用的完整对话流程
 *
 * @param userPrompt 用户自然语言指令
 * @param mcpTools MCP Server 注册的工具列表
 * @param executeToolCallback 执行 MCP 工具的回调函数
 * @param onStep 每一步的回调（用于实时展示）
 * @returns 最终对话结果
 */
export async function runLLMWithMCP(
  userPrompt: string,
  mcpTools: Array<{ name: string; description: string; inputSchema?: Record<string, unknown> }>,
  executeToolCallback: (toolName: string, args: Record<string, unknown>) => Promise<unknown>,
  onStep?: (step: LLMStep) => void
): Promise<{ finalMessage: string; steps: LLMStep[] }> {
  const steps: LLMStep[] = []
  const now = () => new Date().toLocaleTimeString('zh-CN', { hour12: false })

  // 将 MCP 工具转换为 OpenAI function calling 格式
  const llmTools: LLMTool[] = mcpTools.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: (tool.inputSchema as any) || {
        type: 'object',
        properties: { scenarioId: { type: 'string', description: '场景 ID: event / approval / feedback' } },
        required: ['scenarioId']
      }
    }
  }))

  // 构建对话消息
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `你是一个表单搭建助手。你可以调用以下 MCP 工具来帮助用户搭建表单页面：
- form.createPage: 创建表单页面容器
- form.addField: 添加表单字段
- form.setValidation: 配置校验规则
- form.previewRender: 刷新画布并返回完整 Schema

根据用户的自然语言指令，依次调用这 4 个工具完成表单搭建。所有工具都需要 scenarioId 参数，可选值：event（活动报名）、approval（采购审批）、feedback（产品反馈）。根据用户描述自动判断使用哪个场景。`
    },
    { role: 'user', content: userPrompt }
  ]

  // LLM 多轮对话循环（最多 5 轮，防止无限循环）
  for (let round = 0; round < 5; round++) {
    // 记录 LLM 请求
    const llmReqStep: LLMStep = { type: 'llm_request', data: { messages, tools: llmTools }, timestamp: now() }
    steps.push(llmReqStep)
    onStep?.(llmReqStep)

    // 调用 LLM
    const { message: assistantMessage, finish_reason } = await callLLM(messages, llmTools)
    messages.push(assistantMessage)

    // 记录 LLM 响应
    const llmResStep: LLMStep = { type: 'llm_response', data: assistantMessage, timestamp: now() }
    steps.push(llmResStep)
    onStep?.(llmResStep)

    // 如果 LLM 没有返回 tool_calls，说明对话结束
    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      return { finalMessage: assistantMessage.content || '已完成', steps }
    }

    // 执行 LLM 返回的每个 tool_call
    for (const toolCall of assistantMessage.tool_calls) {
      const toolName = toolCall.function.name
      let args: Record<string, unknown>
      try {
        args = JSON.parse(toolCall.function.arguments)
      } catch {
        args = {}
      }

      // 记录工具调用
      const toolCallStep: LLMStep = {
        type: 'tool_call',
        data: { name: toolName, arguments: args },
        timestamp: now()
      }
      steps.push(toolCallStep)
      onStep?.(toolCallStep)

      // 执行 MCP 工具调用
      const toolResult = await executeToolCallback(toolName, args)

      // 记录工具结果
      const toolResultStep: LLMStep = {
        type: 'tool_result',
        data: toolResult,
        timestamp: now()
      }
      steps.push(toolResultStep)
      onStep?.(toolResultStep)

      // 将工具结果加入对话消息
      let resultText: string
      if (toolResult && typeof toolResult === 'object' && 'content' in toolResult) {
        const content = (toolResult as any).content
        if (Array.isArray(content) && content[0]?.text) {
          resultText = content[0].text
        } else {
          resultText = JSON.stringify(toolResult)
        }
      } else {
        resultText = JSON.stringify(toolResult)
      }

      messages.push({
        role: 'tool',
        content: resultText,
        tool_call_id: toolCall.id
      })
    }
  }

  return { finalMessage: '已达到最大对话轮数', steps }
}
