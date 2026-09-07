export const PAGE_TOOL_ACTIONS = [
  'browserState',
  'searchTree',
  'click',
  'scroll',
  'fill',
  'select',
  'executeJavascript',
] as const

export type PageToolAction = (typeof PAGE_TOOL_ACTIONS)[number]
export type PageToolActionCategory = 'query' | 'navigation' | 'form' | 'sideEffect' | 'unknown'
export type PageToolTargetAction = Exclude<
  PageToolAction,
  'browserState' | 'searchTree' | 'executeJavascript'
>

export interface PageToolPolicy {
  allowedActions: readonly PageToolAction[]
  targets?: Partial<Record<PageToolTargetAction, readonly string[]>>
}

export interface PageToolTarget {
  id: string
  action: string
}

export interface PageToolActionContext {
  hasFreshObservation?: boolean
  target?: PageToolTarget
}

export interface PageToolActionResult {
  allowed: boolean
  category: PageToolActionCategory
  reason?: string
}

const ACTION_CATEGORY_MAP: Readonly<Record<PageToolAction, PageToolActionCategory>> = {
  browserState: 'query',
  searchTree: 'query',
  click: 'navigation',
  scroll: 'navigation',
  fill: 'form',
  select: 'form',
  executeJavascript: 'sideEffect',
}

function isPageToolAction(action: unknown): action is PageToolAction {
  return typeof action === 'string' && (PAGE_TOOL_ACTIONS as readonly string[]).includes(action)
}

function isTargetAction(action: PageToolAction): action is PageToolTargetAction {
  return action === 'click' || action === 'scroll' || action === 'fill' || action === 'select'
}

export function getModelVisiblePageToolActions(policy: PageToolPolicy): PageToolAction[] {
  return PAGE_TOOL_ACTIONS.filter((action) => {
    if (!policy.allowedActions.includes(action) || action === 'executeJavascript') return false
    if (!isTargetAction(action)) return true
    return (policy.targets?.[action]?.length ?? 0) > 0
  })
}

export function restrictPageToolInputSchema(
  schema: Record<string, unknown>,
  policy: PageToolPolicy,
): Record<string, unknown> {
  const properties =
    schema.properties && typeof schema.properties === 'object'
      ? (schema.properties as Record<string, unknown>)
      : {}
  const action =
    properties.action && typeof properties.action === 'object'
      ? (properties.action as Record<string, unknown>)
      : {}

  return {
    ...schema,
    properties: {
      ...properties,
      action: {
        ...action,
        enum: getModelVisiblePageToolActions(policy),
      },
    },
  }
}

export function describePageToolPolicy(policy: PageToolPolicy): string {
  const actions = getModelVisiblePageToolActions(policy)
  return `受限 PageTool。仅可把 ${actions.join('、') || '无'} 作为 action；观察、搜索和交互名称是 page-agent-tool 的 action，不是独立工具。MCP 工具名、业务工具名、select_skills 和 call_tool 都不能作为 PageTool action。交互必须使用最新观察返回的 ref，并且目标必须由业务方声明。`
}

export function validatePageToolAction(
  args: Record<string, unknown>,
  context: PageToolActionContext,
  policy: PageToolPolicy,
): PageToolActionResult {
  const action = args.action
  if (!isPageToolAction(action)) {
    return {
      allowed: false,
      category: 'unknown',
      reason:
        typeof action === 'string'
          ? `未知 PageTool action: ${action}`
          : 'PageTool action 缺失或格式无效',
    }
  }

  const category = ACTION_CATEGORY_MAP[action]
  if (!getModelVisiblePageToolActions(policy).includes(action)) {
    return {
      allowed: false,
      category,
      reason:
        category === 'sideEffect'
          ? `副作用动作 ${action} 默认拒绝，请使用带业务 ID、权限和确认合同的专用业务 WebMCP 工具`
          : `PageTool action ${action} 未由业务方开放`,
    }
  }

  if (category === 'query') return { allowed: true, category }
  if (!isTargetAction(action)) {
    return { allowed: false, category, reason: `PageTool action ${action} 不可执行` }
  }

  if (!context.hasFreshObservation) {
    return {
      allowed: false,
      category,
      reason: `动作 ${action} 前必须先获取最新页面状态`,
    }
  }

  const index = args.index
  if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) {
    return {
      allowed: false,
      category,
      reason: `动作 ${action} 必须指定最新页面状态中的目标 ref`,
    }
  }

  const allowedTargetIds = policy.targets?.[action] ?? []
  const targetMatchesCategory =
    context.target?.action === category || context.target?.action === action
  if (!targetMatchesCategory || !allowedTargetIds.includes(context.target?.id ?? '')) {
    return {
      allowed: false,
      category,
      reason: `目标 ${context.target?.id ?? `#${index}`} 未声明允许动作 ${action}`,
    }
  }

  return { allowed: true, category }
}
