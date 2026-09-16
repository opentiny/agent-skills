import { toolPlugin } from '@opentiny/tiny-robot-kit'
import type { WebMcpAdapter } from './webmcp-adapter.ts'

type WebMcpToolDefinition = Awaited<ReturnType<WebMcpAdapter['listTools']>>[number]

export async function listEnabledWebMcpTools(
  adapter: WebMcpAdapter,
): Promise<readonly WebMcpToolDefinition[]> {
  await adapter.refreshTools()

  const serverIds = adapter.runtime.servers.value
    .filter((server) => server.installed && server.enabled)
    .map((server) => server.id)
  const toolIds = Object.fromEntries(
    serverIds.map((serverId) => [
      serverId,
      (adapter.runtime.tools.value[serverId] ?? [])
        .filter((tool) => tool.enabled)
        .map((tool) => tool.id),
    ]),
  )

  return adapter.listTools(serverIds, toolIds)
}

function parseToolArguments(rawArguments: string | undefined): Record<string, unknown> {
  if (!rawArguments?.trim()) return {}
  const parsed = JSON.parse(rawArguments) as unknown
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('WebMCP tool arguments must be a JSON object')
  }
  return parsed as Record<string, unknown>
}

export function createDynamicWebMcpToolPlugin(adapter: WebMcpAdapter) {
  return toolPlugin({
    async getTools() {
      const tools = await listEnabledWebMcpTools(adapter)
      return tools.map((tool) => ({
        type: 'function' as const,
        function: {
          name: tool.name,
          description: tool.description ?? '',
          parameters: tool.inputSchema ?? { type: 'object', properties: {} },
        },
      }))
    },
    async callTool(toolCall) {
      const toolName = toolCall.function.name
      const tools = await listEnabledWebMcpTools(adapter)
      const tool = tools.find((candidate) => candidate.name === toolName)
      if (!tool) throw new Error(`WebMCP tool is not currently enabled: ${toolName}`)

      const result = await adapter.callTool(
        tool.serverId,
        tool.originalName,
        parseToolArguments(toolCall.function.arguments),
      )
      if (typeof result === 'string') return result
      if (result && typeof result === 'object') return result as Record<string, unknown>
      return String(result ?? '')
    },
  })
}
