export interface WebMcpToolDescriptor {
  name: string
  title?: string
  description?: string
  inputSchema?: string | Record<string, unknown>
  execute?: (args: any) => Promise<unknown> | unknown
}

export interface WebMcpModelContext {
  registerTool(descriptor: WebMcpToolDescriptor, options?: { signal?: AbortSignal }): void
  unregisterTool?(name: string): void
  getTools?(): Promise<readonly WebMcpToolDescriptor[]> | readonly WebMcpToolDescriptor[]
  listTools?(): Promise<readonly WebMcpToolDescriptor[]> | readonly WebMcpToolDescriptor[]
  executeTool?(tool: WebMcpToolDescriptor, input: string): Promise<unknown>
  addEventListener?(type: 'toolchange', listener: () => void): void
  removeEventListener?(type: 'toolchange', listener: () => void): void
}

export function getModelContext(): WebMcpModelContext | undefined {
  if (typeof document === 'undefined') return undefined
  return (document as unknown as { modelContext?: WebMcpModelContext }).modelContext
}

export async function listModelContextTools(
  modelContext: WebMcpModelContext,
): Promise<readonly WebMcpToolDescriptor[]> {
  const listTools = modelContext.listTools ?? modelContext.getTools
  if (!listTools) return []
  const tools = await listTools.call(modelContext)
  return Array.isArray(tools) ? tools : []
}

export async function executeModelContextTool(
  modelContext: WebMcpModelContext,
  tool: WebMcpToolDescriptor,
  args: Record<string, unknown>,
): Promise<unknown> {
  if (!modelContext.executeTool) {
    throw new Error(`Browser WebMCP cannot execute tool: ${tool.name}`)
  }
  return modelContext.executeTool(tool, JSON.stringify(args ?? {}))
}
