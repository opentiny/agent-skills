import type {
  ChatMcpRuntime,
  ChatMcpServerInfo,
  ChatMcpToolState,
  UseLocalChatRuntimeMcpAdapter,
} from '@opentiny/tiny-robot-chat'
import { ref } from 'vue'
import type { WebMcpToolDescriptor } from './webmcp-types.ts'
import {
  executeModelContextTool,
  getModelContext,
  listModelContextTools,
} from './webmcp-types.ts'
import {
  describePageToolPolicy,
  restrictPageToolInputSchema,
  validatePageToolAction,
  type PageToolAction,
  type PageToolPolicy,
  type PageToolTarget,
} from '../pagetool/action-policy.ts'

export const WEBMCP_SERVER_ID = 'browser-webmcp'
const DEFAULT_PAGE_TOOL_NAME = 'page-agent-tool'
const PAGE_TOOL_QUERY_ACTIONS = ['browserState', 'searchTree'] as const

export interface PageToolAdapterOptions {
  policy: PageToolPolicy
  toolName?: string
  afterAction?: (context: {
    action: PageToolAction
    target?: PageToolTarget
    result: unknown
  }) => Promise<void> | void
}

export interface CreateWebMcpAdapterOptions {
  pageTool?: PageToolAdapterOptions
}

export interface WebMcpAdapter extends UseLocalChatRuntimeMcpAdapter {
  refreshTools(): Promise<void>
  dispose(): void
}

function parseInputSchema(inputSchema: WebMcpToolDescriptor['inputSchema']): Record<string, unknown> {
  if (typeof inputSchema === 'string') {
    try {
      return {
        type: 'object',
        properties: {},
        ...(JSON.parse(inputSchema) as Record<string, unknown>),
      }
    } catch {
      return { type: 'object', properties: {} }
    }
  }
  return { type: 'object', properties: {}, ...(inputSchema ?? {}) }
}

export function createWebMcpAdapter(options: CreateWebMcpAdapterOptions = {}): WebMcpAdapter {
  const pageToolName = options.pageTool?.toolName ?? DEFAULT_PAGE_TOOL_NAME
  const servers = ref<ChatMcpServerInfo[]>([
    {
      id: WEBMCP_SERVER_ID,
      name: 'Browser WebMCP',
      description: 'Tools registered in the current document.modelContext',
      installed: true,
      enabled: true,
    },
  ])
  const tools = ref<ChatMcpToolState>({ [WEBMCP_SERVER_ID]: [] })
  let observedModelContext = getModelContext()
  let observedPageToolRefs = new Map<number, HTMLElement>()
  let hasFreshPageToolObservation = false

  function isConfiguredPageTool(toolName: string): boolean {
    return Boolean(options.pageTool && toolName === pageToolName)
  }

  async function capturePageToolRefs(): Promise<void> {
    if (typeof document === 'undefined' || !document.body) return
    const { buildA11yTree, getPageAgentToolConfig } = await import('@opentiny/next-sdk')
    observedPageToolRefs = buildA11yTree(
      document.body,
      getPageAgentToolConfig().a11yConfig,
    ).refMap
    hasFreshPageToolObservation = true
  }

  function resolvePageToolTarget(index: unknown): PageToolTarget | undefined {
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) return undefined
    const element = observedPageToolRefs.get(index)
    if (!element?.isConnected) return undefined
    const id = element.getAttribute('data-page-tool-id')
    const action = element.getAttribute('data-page-tool-action')
    return id && action ? { id, action } : undefined
  }

  function assertServerId(serverId: string): void {
    if (serverId !== WEBMCP_SERVER_ID) {
      throw new Error(`Unknown WebMCP server: ${serverId}`)
    }
  }

  async function refreshTools(): Promise<void> {
    const modelContext = getModelContext()
    const previous = new Map(
      (tools.value[WEBMCP_SERVER_ID] ?? []).map((tool) => [tool.id, tool.enabled]),
    )
    const descriptors = modelContext ? await listModelContextTools(modelContext) : []

    tools.value = {
      [WEBMCP_SERVER_ID]: descriptors.map((descriptor) => ({
        id: descriptor.name,
        name: descriptor.title ?? descriptor.name,
        description: descriptor.description,
        enabled: previous.get(descriptor.name) ?? true,
      })),
    }

    if (modelContext !== observedModelContext) {
      observedModelContext?.removeEventListener?.('toolchange', handleToolChange)
      modelContext?.addEventListener?.('toolchange', handleToolChange)
      observedModelContext = modelContext
    }
  }

  function handleToolChange(): void {
    void refreshTools()
  }

  observedModelContext?.addEventListener?.('toolchange', handleToolChange)

  const runtime: ChatMcpRuntime = {
    servers,
    tools,
    async addServer(serverId) {
      assertServerId(serverId)
      servers.value = [{ ...servers.value[0], installed: true, enabled: true, error: undefined }]
      await refreshTools()
    },
    removeServer(serverId) {
      assertServerId(serverId)
      servers.value = [{ ...servers.value[0], installed: false, enabled: false }]
    },
    async setServerEnabled(serverId, enabled) {
      assertServerId(serverId)
      servers.value = [{ ...servers.value[0], enabled }]
      if (enabled) await refreshTools()
    },
    setToolEnabled(serverId, toolId, enabled) {
      assertServerId(serverId)
      const currentTools = tools.value[WEBMCP_SERVER_ID] ?? []
      if (!currentTools.some((tool) => tool.id === toolId)) {
        throw new Error(`Unknown WebMCP tool: ${toolId}`)
      }
      tools.value = {
        [WEBMCP_SERVER_ID]: currentTools.map((tool) =>
          tool.id === toolId ? { ...tool, enabled } : tool,
        ),
      }
    },
  }

  const adapter: WebMcpAdapter = {
    runtime,
    refreshTools,
    async listTools(serverIds, toolIds) {
      if (!serverIds.includes(WEBMCP_SERVER_ID)) return []
      await refreshTools()
      const modelContext = getModelContext()
      const descriptors = modelContext ? await listModelContextTools(modelContext) : []
      const selectedToolIds = toolIds[WEBMCP_SERVER_ID] ?? []

      return descriptors
        .filter((tool) => selectedToolIds.includes(tool.name))
        .map((tool) => ({
          serverId: WEBMCP_SERVER_ID,
          id: tool.name,
          name: `${WEBMCP_SERVER_ID}__${tool.name}`,
          originalName: tool.name,
          description: isConfiguredPageTool(tool.name)
            ? [tool.description, describePageToolPolicy(options.pageTool!.policy)]
                .filter(Boolean)
                .join('\n\n')
            : tool.description,
          inputSchema: isConfiguredPageTool(tool.name)
            ? restrictPageToolInputSchema(
                parseInputSchema(tool.inputSchema),
                options.pageTool!.policy,
              )
            : parseInputSchema(tool.inputSchema),
        }))
    },
    async callTool(serverId, toolName, args) {
      assertServerId(serverId)
      let pageToolAction: PageToolAction | undefined
      let pageToolTarget: PageToolTarget | undefined
      if (isConfiguredPageTool(toolName)) {
        pageToolTarget = resolvePageToolTarget(args.index)
        const policyResult = validatePageToolAction(
          args,
          {
            hasFreshObservation: hasFreshPageToolObservation,
            target: pageToolTarget,
          },
          options.pageTool!.policy,
        )
        if (!policyResult.allowed) {
          throw new Error(`PageTool action rejected: ${policyResult.reason}`)
        }
        pageToolAction = args.action as PageToolAction
      }
      const modelContext = getModelContext()
      if (!modelContext) {
        throw new Error('document.modelContext WebMCP API is not available')
      }
      const descriptors = await listModelContextTools(modelContext)
      const descriptor = descriptors.find((tool) => tool.name === toolName)
      if (!descriptor) throw new Error(`WebMCP tool not found: ${toolName}`)
      const result = await executeModelContextTool(modelContext, descriptor, args)

      if (
        isConfiguredPageTool(toolName) &&
        PAGE_TOOL_QUERY_ACTIONS.includes(
          args.action as (typeof PAGE_TOOL_QUERY_ACTIONS)[number],
        )
      ) {
        await capturePageToolRefs()
      } else {
        observedPageToolRefs.clear()
        hasFreshPageToolObservation = false
      }

      if (pageToolAction) {
        await options.pageTool?.afterAction?.({
          action: pageToolAction,
          target: pageToolTarget,
          result,
        })
      }

      return result
    },
    dispose() {
      observedModelContext?.removeEventListener?.('toolchange', handleToolChange)
      observedModelContext = undefined
      observedPageToolRefs.clear()
      hasFreshPageToolObservation = false
    },
  }

  void refreshTools()
  return adapter
}
