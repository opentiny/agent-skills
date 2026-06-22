/**
 * 前端 MCP Client API 层
 * 通过 Streamable HTTP (SSE) 与 MCP Server 通信
 * 支持逐步调用并记录完整的 JSON-RPC 交互报文
 */

import { reactive } from 'vue'

const MCP_ENDPOINT = '/mcp'

let requestId = 0
function nextId(): number {
  requestId += 1
  return requestId
}

/** MCP 交互记录 */
export interface McpLogEntry {
  id: number
  direction: 'request' | 'response'
  method: string
  toolName?: string
  timestamp: string
  body: unknown
  status?: number
  duration?: number
}

const logEntries = reactive<McpLogEntry[]>([])
export function getMcpLogs(): McpLogEntry[] { return logEntries }
export function clearMcpLogs(): void { logEntries.splice(0, logEntries.length) }
function addLog(entry: McpLogEntry): void { logEntries.push(entry) }
function now(): string { return new Date().toLocaleTimeString('zh-CN', { hour12: false }) }

/** MCP Server 连接状态 */
export interface McpConnectionState {
  initialized: boolean
  serverInfo: { name: string; version: string } | null
  capabilities: Record<string, unknown> | null
  tools: Array<{ name: string; description: string; inputSchema?: unknown }>
  resources: Array<{ name: string; uri: string; mimeType?: string }>
}

const connectionState = reactive<McpConnectionState>({
  initialized: false,
  serverInfo: null,
  capabilities: null,
  tools: [],
  resources: []
})

export function getConnectionState(): McpConnectionState { return connectionState }

/**
 * 发送 MCP JSON-RPC 请求，记录完整报文
 */
async function mcpRequest(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
  const id = nextId()
  const body = { jsonrpc: '2.0', id, method, params }
  const startTime = Date.now()

  addLog({
    id, direction: 'request', method,
    toolName: params.name as string | undefined,
    timestamp: now(), body
  })

  try {
    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify(body)
    })

    const duration = Date.now() - startTime
    const contentType = response.headers.get('content-type') || ''
    let result: unknown

    if (contentType.includes('text/event-stream')) {
      const text = await response.text()
      result = parseSseText(text)
    } else {
      const json = await response.json()
      result = json.result ?? json
    }

    addLog({
      id, direction: 'response', method,
      toolName: params.name as string | undefined,
      timestamp: now(), body: result,
      status: response.status, duration
    })

    return result
  } catch (error: any) {
    addLog({
      id, direction: 'response', method,
      toolName: params.name as string | undefined,
      timestamp: now(), body: { error: error.message },
      status: 0, duration: Date.now() - startTime
    })
    throw error
  }
}

function parseSseText(text: string): unknown {
  const lines = text.split('\n')
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      try {
        const data = JSON.parse(line.slice(6))
        if (data.result) return data.result
      } catch { /* skip */ }
    }
  }
  return null
}

/** 从 MCP 工具返回结果中提取 data 字段 */
export function extractMcpData(result: any): any {
  if (result?.content?.[0]?.text) {
    try {
      const parsed = JSON.parse(result.content[0].text)
      return parsed.data ?? parsed
    } catch { /* skip */ }
  }
  return result
}

// ========== MCP 协议标准方法 ==========

/** Step 1: 初始化 MCP 连接 */
export async function mcpInitialize(): Promise<unknown> {
  const result = await mcpRequest('initialize', {
    protocolVersion: '2025-03-26',
    capabilities: {},
    clientInfo: { name: 'tinyvue-mcp-demo', version: '1.0.0' }
  }) as any

  if (result) {
    connectionState.initialized = true
    connectionState.serverInfo = result.serverInfo ?? null
    connectionState.capabilities = result.capabilities ?? null
  }
  return result
}

/** Step 2: 发送 initialized 通知 */
export async function mcpInitialized(): Promise<void> {
  await mcpRequest('notifications/initialized', {})
}

/** Step 3: 获取 MCP 工具列表 */
export async function mcpListTools(): Promise<unknown> {
  const result = await mcpRequest('tools/list', {}) as any
  if (result?.tools) {
    connectionState.tools = result.tools
  }
  return result
}

/** Step 4: 获取 MCP 资源列表 */
export async function mcpListResources(): Promise<unknown> {
  const result = await mcpRequest('resources/list', {}) as any
  if (result?.resources) {
    connectionState.resources = result.resources
  }
  return result
}

/** Step 5+: 调用 MCP 工具 */
export async function mcpCallTool(toolName: string, args: Record<string, unknown>): Promise<unknown> {
  return mcpRequest('tools/call', { name: toolName, arguments: args })
}

/** Step 5+: 读取 MCP 资源 */
export async function mcpReadResource(uri: string): Promise<unknown> {
  return mcpRequest('resources/read', { uri })
}

/**
 * 执行完整的 MCP 表单搭建流程（逐步真实调用）
 * 返回每一步的结果，让 UI 可以逐步展示
 */
export interface McpPipelineStep {
  step: string
  label: string
  result: unknown
}

export async function runMcpPipeline(scenarioId: string): Promise<McpPipelineStep[]> {
  const steps: McpPipelineStep[] = []

  // Step 1: initialize - 与 MCP Server 建立连接
  steps.push({ step: 'initialize', label: '初始化 MCP 连接', result: await mcpInitialize() })

  // Step 2: initialized 通知
  await mcpInitialized()
  steps.push({ step: 'initialized', label: '发送 initialized 通知', result: null })

  // Step 3: tools/list - 查询 MCP Server 注册的工具
  steps.push({ step: 'tools/list', label: '获取 MCP 工具列表', result: await mcpListTools() })

  // Step 4: resources/list - 查询 MCP Server 注册的资源
  steps.push({ step: 'resources/list', label: '获取 MCP 资源列表', result: await mcpListResources() })

  // Step 5: form.createPage
  steps.push({ step: 'tools/call/createPage', label: '调用 form.createPage', result: await mcpCallTool('form.createPage', { scenarioId }) })

  // Step 6: form.addField
  steps.push({ step: 'tools/call/addField', label: '调用 form.addField', result: await mcpCallTool('form.addField', { scenarioId }) })

  // Step 7: form.setValidation
  steps.push({ step: 'tools/call/setValidation', label: '调用 form.setValidation', result: await mcpCallTool('form.setValidation', { scenarioId }) })

  // Step 8: form.previewRender
  steps.push({ step: 'tools/call/previewRender', label: '调用 form.previewRender', result: await mcpCallTool('form.previewRender', { scenarioId }) })

  return steps
}

// ========== LLM + MCP 对话 ==========

/** LLM 交互步骤（对应后端 LLMStep） */
export interface LLMStepEntry {
  type: 'llm_request' | 'llm_response' | 'tool_call' | 'tool_result'
  data: unknown
  timestamp: string
}

/** LLM 对话结果 */
export interface LLMChatResult {
  success: boolean
  finalMessage: string
  steps: LLMStepEntry[]
  error?: string
}

/**
 * 调用后端 LLM 中间层
 * 前端发送自然语言 → 后端 LLM 决策调用 MCP 工具 → 返回完整交互过程
 */
export async function chatWithLLM(prompt: string): Promise<LLMChatResult> {
  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`LLM chat failed: ${response.status} ${errText}`)
  }

  const data = await response.json()

  // 记录 LLM 交互步骤到日志
  if (data.steps) {
    for (const step of data.steps as LLMStepEntry[]) {
      const label = step.type === 'llm_request' ? 'LLM 请求'
        : step.type === 'llm_response' ? 'LLM 响应'
        : step.type === 'tool_call' ? 'MCP 工具调用'
        : 'MCP 工具结果'

      addLog({
        id: nextId(),
        direction: step.type === 'llm_request' || step.type === 'tool_call' ? 'request' : 'response',
        method: step.type,
        toolName: step.type === 'tool_call' ? (step.data as any)?.name : undefined,
        timestamp: step.timestamp,
        body: step.data
      })
    }
  }

  return {
    success: data.success,
    finalMessage: data.finalMessage,
    steps: data.steps || [],
    error: data.error
  }
}
