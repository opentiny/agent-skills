import {
  initializeBuiltinWebMCP,
  registerPageAgentTool,
  setNavigator,
} from '@opentiny/next-sdk'

export const DEFAULT_PAGETOOL_BLACKLIST = [
  '.chat-add-window',
  '.chat-add-launcher',
  '.tr-sender',
  '.tr-bubble',
  '[data-page-tool-exclude="true"]',
] as const

export interface InitializePageToolOptions {
  navigator?: (route: string) => void | boolean | Promise<void | boolean>
  blacklist?: readonly string[]
  whitelist?: readonly string[]
  exposedAttributes?: readonly string[]
  enableHighlight?: boolean
}

let initialized = false

export function initializePageTool(options: InitializePageToolOptions = {}): void {
  if (initialized) return
  initialized = true

  initializeBuiltinWebMCP()
  registerPageAgentTool({
    enableHighlight: options.enableHighlight ?? false,
    removeMaskAfterToolCall: true,
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

  if (options.navigator) setNavigator(options.navigator)
}
