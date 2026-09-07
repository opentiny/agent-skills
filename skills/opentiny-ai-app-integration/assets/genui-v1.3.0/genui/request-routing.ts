export interface ChatRequestTargetOptions {
  modelId: string
  modelUrl: string
  genuiEnabled: boolean
  genuiUrl?: string
}

export interface ChatAuthorizationKeyOptions {
  genuiEnabled: boolean
  modelApiKey?: string
  genuiApiKey?: string
}

export function normalizeChatCompletionsUrl(url: string): string {
  const normalized = url.trim().replace(/\/+$/, '')
  return normalized.endsWith('/chat/completions') ? normalized : `${normalized}/chat/completions`
}

export function resolveChatRequestTarget(options: ChatRequestTargetOptions): { modelId: string; url: string } {
  const requestUrl = options.genuiEnabled ? options.genuiUrl : options.modelUrl

  if (!requestUrl?.trim()) {
    throw new Error(options.genuiEnabled ? 'GenUI 服务地址未配置' : `模型 ${options.modelId} 的服务地址未配置`)
  }

  return {
    modelId: options.modelId,
    url: normalizeChatCompletionsUrl(requestUrl),
  }
}

export function resolveChatAuthorizationKey(options: ChatAuthorizationKeyOptions): string | undefined {
  return options.genuiEnabled ? options.genuiApiKey?.trim() || undefined : options.modelApiKey?.trim() || undefined
}
