import {
  initializeBuiltinWebMCP,
  registerPageAgentTool,
  type PageAgentCursorMode,
} from '@opentiny/next-sdk'

export const DEFAULT_PAGETOOL_BLACKLIST = [
  '.chat-add-window',
  '.chat-add-launcher',
  '.tr-sender',
  '.tr-bubble',
  '[data-page-tool-exclude="true"]',
] as const

export interface InitializePageToolOptions {
  blacklist?: readonly string[]
  whitelist?: readonly string[]
  exposedAttributes?: readonly string[]
  enableHighlight?: boolean
  cursorMode?: PageAgentCursorMode
}

let initialized = false

export function initializePageTool(options: InitializePageToolOptions = {}): void {
  if (initialized) return
  initialized = true

  initializeBuiltinWebMCP()
  registerPageAgentTool({
    enableHighlight: options.enableHighlight ?? false,
    removeMaskAfterToolCall: true,
    cursorMode: options.cursorMode ?? 'actionOnly',
    a11yConfig: {
      blacklist: [...DEFAULT_PAGETOOL_BLACKLIST, ...(options.blacklist ?? [])],
      whitelist: [...(options.whitelist ?? [])],
      exposedAttributes: [
        'data-page-tool-id',
        'data-page-tool-action',
        ...(options.exposedAttributes ?? []),
      ],
    },
  })

}
