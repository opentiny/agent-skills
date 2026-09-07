import type {
  ChatBuiltInModelFeature,
  ChatModelRuntime,
  ChatProviderConfig,
  ChatProviderFeatureBody,
} from '@opentiny/tiny-robot-chat'
import { sseStreamToGenerator, type ChatCompletion, type ResponseProvider } from '@opentiny/tiny-robot-kit'
import { computed, reactive, ref } from 'vue'
import { resolveChatAuthorizationKey, resolveChatRequestTarget } from './request-routing.ts'

const BUILT_IN_FEATURES = ['thinking', 'search'] as const satisfies readonly ChatBuiltInModelFeature[]

const PROVIDER_DEFAULTS: Record<
  ChatProviderConfig['type'],
  {
    apiUrl: string
    featureBody?: Partial<Record<ChatBuiltInModelFeature, ChatProviderFeatureBody>>
  }
> = {
  openai: { apiUrl: 'https://api.openai.com/v1' },
  deepseek: {
    apiUrl: 'https://api.deepseek.com/chat/completions',
    featureBody: {
      thinking: {
        enabled: { thinking: { type: 'enabled' } },
        disabled: { thinking: { type: 'disabled' } },
      },
    },
  },
  qwen: {
    apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    featureBody: {
      thinking: {
        enabled: { enable_thinking: true },
        disabled: { enable_thinking: false },
      },
      search: {
        enabled: { enable_search: true },
      },
    },
  },
}

interface ResolvedModel {
  id: string
  label: string
  capabilities?: Readonly<Partial<Record<ChatBuiltInModelFeature, boolean>>>
  apiUrl: string
  apiKey?: string
  headers?: Record<string, string>
  timeout?: number
  featureBody?: Partial<Record<ChatBuiltInModelFeature, ChatProviderFeatureBody>>
}

export interface CreateChatProviderRuntimeOptions {
  modelProviders: readonly ChatProviderConfig[]
  isGenuiEnabled: () => boolean
  genuiUrl?: string
  genuiPromptId?: string
  genuiApiKey?: string
  fetchImpl?: typeof fetch
}

export interface ChatProviderRuntime {
  model: ChatModelRuntime
  responseProvider: ResponseProvider<ChatCompletion>
}

function resolveModels(providers: readonly ChatProviderConfig[]): ResolvedModel[] {
  const ids = new Set<string>()

  return providers.flatMap((provider) => {
    const defaults = PROVIDER_DEFAULTS[provider.type]

    return provider.models.map((model) => {
      if (ids.has(model.id)) throw new Error(`Duplicate model id: ${model.id}`)
      ids.add(model.id)

      return {
        id: model.id,
        label: model.label,
        capabilities: model.capabilities,
        apiUrl: provider.apiUrl ?? defaults.apiUrl,
        apiKey: provider.apiKey,
        headers: provider.headers,
        timeout: provider.timeout,
        featureBody: {
          ...defaults.featureBody,
          ...model.featureBody,
        },
      }
    })
  })
}

export function createChatProviderRuntime(options: CreateChatProviderRuntimeOptions): ChatProviderRuntime {
  const models = resolveModels(options.modelProviders)
  const selectedId = ref<string | null>(models[0]?.id ?? null)
  const featureState = reactive<Partial<Record<ChatBuiltInModelFeature, boolean>>>({})
  const selectedModel = computed(() => models.find((model) => model.id === selectedId.value))

  const model: ChatModelRuntime = {
    options: computed(() =>
      models.map(({ id, label, capabilities }) => ({
        id,
        label,
        capabilities,
      })),
    ),
    selectedId: computed(() => selectedId.value),
    features: computed(() =>
      Object.fromEntries(
        BUILT_IN_FEATURES.map((feature) => [
          feature,
          Boolean(selectedModel.value?.capabilities?.[feature] && featureState[feature]),
        ]),
      ),
    ),
    select(id) {
      if (id !== null && !models.some((candidate) => candidate.id === id)) {
        throw new Error(`Unknown model: ${id}`)
      }

      selectedId.value = id
      for (const feature of BUILT_IN_FEATURES) {
        if (!selectedModel.value?.capabilities?.[feature]) featureState[feature] = false
      }
    },
    setFeature(feature, enabled) {
      if (enabled && !selectedModel.value?.capabilities?.[feature]) {
        throw new Error(`Current model does not support ${feature}`)
      }
      featureState[feature] = enabled
    },
  }

  const responseProvider: ResponseProvider<ChatCompletion> = async (requestBody, abortSignal) => {
    const activeModel = selectedModel.value
    if (!activeModel) throw new Error('No model selected for this turn.')

    const genuiEnabled = options.isGenuiEnabled()
    const target = resolveChatRequestTarget({
      modelId: activeModel.id,
      modelUrl: activeModel.apiUrl,
      genuiEnabled,
      genuiUrl: options.genuiUrl,
    })
    const authorizationKey = resolveChatAuthorizationKey({
      genuiEnabled,
      genuiApiKey: options.genuiApiKey,
      modelApiKey: activeModel.apiKey,
    })
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(genuiEnabled ? undefined : activeModel.headers),
    }

    if (authorizationKey && !Object.keys(headers).some((header) => header.toLowerCase() === 'authorization')) {
      headers.Authorization = `Bearer ${authorizationKey}`
    }

    const body: Record<string, unknown> = {
      ...requestBody,
      model: target.modelId,
      stream: true,
    }

    for (const feature of BUILT_IN_FEATURES) {
      const featureBody = activeModel.featureBody?.[feature]
      const value = featureState[feature] ? featureBody?.enabled : featureBody?.disabled
      if (value) Object.assign(body, value)
    }

    if (genuiEnabled) {
      const promptId = options.genuiPromptId?.trim()
      if (!promptId) throw new Error('GenUI Prompt ID 未配置')
      body.prompt = {
        strategy: 'append',
        id: promptId,
        params: {
          customComponents: [],
          customExamples: [],
          customSnippets: [],
          customActions: [],
        },
      }
    }

    const timeoutController = activeModel.timeout === undefined ? null : new AbortController()
    const timeoutId = timeoutController
      ? window.setTimeout(
          () => timeoutController.abort(new Error(`Provider request timed out after ${activeModel.timeout}ms.`)),
          activeModel.timeout,
        )
      : undefined
    const signal = timeoutController ? AbortSignal.any([abortSignal, timeoutController.signal]) : abortSignal

    try {
      const response = await (options.fetchImpl ?? fetch)(target.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal,
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)

      return (async function* () {
        try {
          yield* sseStreamToGenerator<ChatCompletion>(response, { signal })
        } finally {
          if (timeoutId !== undefined) window.clearTimeout(timeoutId)
        }
      })()
    } catch (error) {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      throw error
    }
  }

  return { model, responseProvider }
}
