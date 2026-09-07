import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('GenUI stream parser separates markdown and schema-card content across chunks', async () => {
  let createGenuiStreamParser

  try {
    ;({ createGenuiStreamParser } = await import('../src/tiny-robot-chat/genui/stream-parser.ts'))
  } catch {}

  assert.equal(typeof createGenuiStreamParser, 'function')

  const parts = []
  const parser = createGenuiStreamParser({
    onMarkdown: (content) => parts.push({ type: 'text', text: content }),
    onSchemaCard: (content) => parts.push({ type: 'schema-card', content }),
  })

  parser.write('先看概览\n```sche')
  parser.write('maJson\n{"componentName":"Page"}\n```\n完成')
  parser.end()

  assert.deepEqual(parts, [
    { type: 'text', text: '先看概览\n' },
    { type: 'schema-card', content: '\n{"componentName":"Page"}' },
    { type: 'text', text: '\n完成' },
  ])
})

test('GenUI message plugin stores ordered text and schema-card parts', async () => {
  let createGenuiSchemaStreamPlugin

  try {
    ;({ createGenuiSchemaStreamPlugin } = await import('../src/tiny-robot-chat/genui/stream-plugin.ts'))
  } catch {}

  assert.equal(typeof createGenuiSchemaStreamPlugin, 'function')

  const plugin = createGenuiSchemaStreamPlugin(() => true)
  const message = { role: 'assistant', content: '', state: {} }

  plugin.onTurnStart?.({})
  plugin.onCompletionChunk?.({ currentMessage: message, choice: { delta: { content: '说明\n```schemaJson\n{' } } })
  plugin.onCompletionChunk?.({
    currentMessage: message,
    choice: { delta: { content: '"componentName":"Page"}\n```\n结束' } },
  })
  plugin.onFinally?.({})

  assert.deepEqual(message.state.genuiContent, [
    { type: 'text', text: '说明\n' },
    { type: 'schema-card', content: '\n{"componentName":"Page"}' },
    { type: 'text', text: '\n结束' },
  ])
})

test('GenUI switch is rendered through the TinyRobot sender footer', async () => {
  const chatSource = await readFile(new URL('../src/TinyRobotChat.vue', import.meta.url), 'utf8')
  const composerToolsSource = await readFile(
    new URL('../src/tiny-robot-chat/components/ComposerTools.vue', import.meta.url),
    'utf8',
  )

  assert.match(chatSource, /<template\s+#sender-footer>/)
  assert.match(chatSource, /runtime\.composer\.model\s*=\s*providerRuntime\.model/)
  assert.doesNotMatch(composerToolsSource, /GenUI|genui/)
})

test('GenUI provider runtime keeps the selected model and uses isolated GenUI auth', async () => {
  let createChatProviderRuntime

  try {
    ;({ createChatProviderRuntime } = await import('../src/tiny-robot-chat/genui/provider-runtime.ts'))
  } catch {}

  assert.equal(typeof createChatProviderRuntime, 'function')

  const requests = []
  const providerRuntime = createChatProviderRuntime({
    modelProviders: [
      {
        type: 'openai',
        apiUrl: 'https://model.example.com/v1',
        apiKey: 'model-secret',
        models: [
          { id: 'model-small', label: 'Model Small' },
          { id: 'model-large', label: 'Model Large' },
        ],
      },
    ],
    isGenuiEnabled: () => true,
    genuiUrl: 'https://genui.example.com/api/v1',
    genuiPromptId: 'prompt-1',
    genuiApiKey: 'genui-secret',
    fetchImpl: async (url, init) => {
      requests.push({ url, init })
      return new Response('data: [DONE]\n\n', { status: 200 })
    },
  })

  await providerRuntime.model.select('model-large')
  await providerRuntime.responseProvider({ messages: [{ role: 'user', content: '生成卡片' }] }, new AbortController().signal)

  assert.equal(providerRuntime.model.selectedId.value, 'model-large')
  assert.equal(requests[0].url, 'https://genui.example.com/api/v1/chat/completions')
  assert.equal(requests[0].init.headers.Authorization, 'Bearer genui-secret')
  assert.doesNotMatch(JSON.stringify(requests[0]), /model-secret/)
  assert.deepEqual(JSON.parse(requests[0].init.body), {
    messages: [{ role: 'user', content: '生成卡片' }],
    model: 'model-large',
    stream: true,
    prompt: {
      strategy: 'append',
      id: 'prompt-1',
      params: {
        customComponents: [],
        customExamples: [],
        customSnippets: [],
        customActions: [],
      },
    },
  })
})

test('GenUI request routing preserves the selected model', async () => {
  let resolveChatRequestTarget

  try {
    ;({ resolveChatRequestTarget } = await import('../src/tiny-robot-chat/genui/request-routing.ts'))
  } catch {
    // RED: dynamic GenUI request routing is introduced by this change.
  }

  assert.equal(typeof resolveChatRequestTarget, 'function')
  assert.deepEqual(
    resolveChatRequestTarget({
      modelId: 'model-large',
      modelUrl: 'https://model.example.com/v1/chat/completions',
      genuiEnabled: true,
      genuiUrl: 'https://chat.example.com/api/v1/ai/prompt/chat/completions',
    }),
    {
      modelId: 'model-large',
      url: 'https://chat.example.com/api/v1/ai/prompt/chat/completions',
    },
  )
})

test('GenUI requests never forward the selected model API key', async () => {
  const { resolveChatAuthorizationKey } = await import(
    '../src/tiny-robot-chat/genui/request-routing.ts'
  ).catch(() => ({}))

  assert.equal(typeof resolveChatAuthorizationKey, 'function')
  assert.equal(
    resolveChatAuthorizationKey({ genuiEnabled: true, modelApiKey: 'model-secret' }),
    undefined,
  )
  assert.equal(
    resolveChatAuthorizationKey({
      genuiEnabled: true,
      genuiApiKey: 'genui-secret',
      modelApiKey: 'model-secret',
    }),
    'genui-secret',
  )
  assert.equal(
    resolveChatAuthorizationKey({ genuiEnabled: false, modelApiKey: 'model-secret' }),
    'model-secret',
  )
})
