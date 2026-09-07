import assert from 'node:assert/strict'
import test from 'node:test'

if (typeof document === 'undefined') {
  globalThis.document = {
    createElement: () => ({ style: {}, content: [] }),
    createTextNode: () => ({}),
  }
}

function setModelContext(modelContext) {
  globalThis.document.modelContext = modelContext
}

function clearModelContext() {
  delete globalThis.document.modelContext
}

test('lists selected tools with the TinyRobot server namespace', async () => {
  setModelContext({
    registerTool() {},
    getTools: async () => [
      {
        name: 'query-business-data',
        description: 'Query business data',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
    executeTool: async () => ({}),
  })

  const { createWebMcpAdapter } = await import('../webmcp/webmcp-adapter.ts')
  const adapter = createWebMcpAdapter()
  const tools = await adapter.listTools(
    ['browser-webmcp'],
    { 'browser-webmcp': ['query-business-data'] },
  )

  assert.equal(tools[0].name, 'browser-webmcp__query-business-data')
  assert.equal(tools[0].originalName, 'query-business-data')
  adapter.dispose()
  clearModelContext()
})

test('executes the current descriptor with JSON serialized arguments', async () => {
  const descriptor = {
    name: 'query-business-data',
    description: 'Query business data',
    inputSchema: {},
  }
  let execution
  setModelContext({
    registerTool() {},
    listTools: async () => [descriptor],
    executeTool: async (tool, input) => {
      execution = { tool, input }
      return { ok: true }
    },
  })

  const { createWebMcpAdapter } = await import('../webmcp/webmcp-adapter.ts')
  const adapter = createWebMcpAdapter()
  const result = await adapter.callTool(
    'browser-webmcp',
    'query-business-data',
    { keyword: 'sample' },
  )

  assert.deepEqual(execution, {
    tool: descriptor,
    input: '{"keyword":"sample"}',
  })
  assert.deepEqual(result, { ok: true })
  adapter.dispose()
  clearModelContext()
})

test('refreshes tools registered after the adapter is created', async () => {
  let descriptors = []
  let toolchangeListener
  setModelContext({
    registerTool() {},
    listTools: async () => descriptors,
    executeTool: async () => ({}),
    addEventListener(type, listener) {
      if (type === 'toolchange') toolchangeListener = listener
    },
    removeEventListener() {},
  })

  const { createWebMcpAdapter } = await import('../webmcp/webmcp-adapter.ts')
  const adapter = createWebMcpAdapter()
  await adapter.refreshTools()

  descriptors = [{ name: 'late-tool', description: 'Registered later', inputSchema: {} }]
  toolchangeListener()
  await new Promise((resolve) => setImmediate(resolve))

  assert.deepEqual(
    adapter.runtime.tools.value['browser-webmcp'].map((tool) => tool.id),
    ['late-tool'],
  )
  adapter.dispose()
  clearModelContext()
})

test('restricts the model-visible PageTool action schema from business policy', async () => {
  setModelContext({
    registerTool() {},
    listTools: async () => [
      {
        name: 'page-agent-tool',
        description: 'Operate the current page',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['browserState', 'searchTree', 'click', 'scroll', 'fill', 'select', 'executeJavascript'],
            },
          },
        },
      },
    ],
    executeTool: async () => ({}),
  })

  const { createWebMcpAdapter } = await import('../webmcp/webmcp-adapter.ts')
  const adapter = createWebMcpAdapter({
    pageTool: {
      policy: {
        allowedActions: ['browserState', 'searchTree', 'click'],
        targets: { click: ['reports-navigation'] },
      },
    },
  })
  const tools = await adapter.listTools(
    ['browser-webmcp'],
    { 'browser-webmcp': ['page-agent-tool'] },
  )

  assert.deepEqual(tools[0].inputSchema.properties.action.enum, [
    'browserState',
    'searchTree',
    'click',
  ])
  adapter.dispose()
  clearModelContext()
})

test('blocks unknown PageTool actions before the browser descriptor executes', async () => {
  let executionCount = 0
  setModelContext({
    registerTool() {},
    listTools: async () => [
      {
        name: 'page-agent-tool',
        description: 'Operate the current page',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
    executeTool: async () => {
      executionCount += 1
      return {}
    },
  })

  const { createWebMcpAdapter } = await import('../webmcp/webmcp-adapter.ts')
  const adapter = createWebMcpAdapter({
    pageTool: {
      policy: {
        allowedActions: ['browserState', 'click'],
        targets: { click: ['reports-navigation'] },
      },
    },
  })

  await assert.rejects(
    adapter.callTool('browser-webmcp', 'page-agent-tool', { action: 'report_detail' }),
    /未知 PageTool action/,
  )
  assert.equal(executionCount, 0)
  adapter.dispose()
  clearModelContext()
})
