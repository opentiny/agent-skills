import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getModelVisiblePageToolActions,
  restrictPageToolInputSchema,
  validatePageToolAction,
} from '../pagetool/action-policy.ts'

const policy = {
  allowedActions: ['browserState', 'searchTree', 'click', 'scroll'],
  targets: {
    click: ['reports-navigation'],
    scroll: ['reports-list'],
  },
}

test('only exposes actions allowed by the declared PageTool policy', () => {
  const schema = restrictPageToolInputSchema(
    {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['browserState', 'searchTree', 'click', 'scroll', 'fill', 'select', 'executeJavascript'],
        },
      },
    },
    policy,
  )

  assert.deepEqual(schema.properties.action.enum, ['browserState', 'searchTree', 'click', 'scroll'])
  assert.deepEqual(getModelVisiblePageToolActions(policy), [
    'browserState',
    'searchTree',
    'click',
    'scroll',
  ])
})

test('rejects missing, unknown, and tool-shaped PageTool actions', () => {
  for (const action of [undefined, 'call_tool', 'report_detail']) {
    const result = validatePageToolAction(
      action === undefined ? {} : { action },
      {},
      policy,
    )
    assert.equal(result.allowed, false)
    assert.equal(result.category, 'unknown')
  }
})

test('requires a fresh observation and declared target for navigation', () => {
  const withoutObservation = validatePageToolAction(
    { action: 'click', index: 4 },
    {
      target: { id: 'reports-navigation', action: 'navigation' },
    },
    policy,
  )
  assert.equal(withoutObservation.allowed, false)

  const wrongTarget = validatePageToolAction(
    { action: 'click', index: 4 },
    {
      hasFreshObservation: true,
      target: { id: 'unapproved-navigation', action: 'navigation' },
    },
    policy,
  )
  assert.equal(wrongTarget.allowed, false)

  const allowed = validatePageToolAction(
    { action: 'click', index: 4 },
    {
      hasFreshObservation: true,
      target: { id: 'reports-navigation', action: 'navigation' },
    },
    policy,
  )
  assert.equal(allowed.allowed, true)
})

test('allows a form action only when both action and target are explicitly declared', () => {
  const formPolicy = {
    allowedActions: ['browserState', 'fill'],
    targets: { fill: ['approved-search-field'] },
  }

  const allowed = validatePageToolAction(
    { action: 'fill', index: 8, value: 'sample' },
    {
      hasFreshObservation: true,
      target: { id: 'approved-search-field', action: 'form' },
    },
    formPolicy,
  )
  assert.equal(allowed.allowed, true)

  const rejected = validatePageToolAction(
    { action: 'fill', index: 9, value: 'sample' },
    {
      hasFreshObservation: true,
      target: { id: 'undeclared-field', action: 'form' },
    },
    formPolicy,
  )
  assert.equal(rejected.allowed, false)
})

test('never exposes or allows executeJavascript through the generic PageTool policy', () => {
  const unsafePolicy = {
    allowedActions: ['browserState', 'executeJavascript'],
    targets: {},
  }

  assert.deepEqual(getModelVisiblePageToolActions(unsafePolicy), ['browserState'])
  assert.equal(
    validatePageToolAction({ action: 'executeJavascript' }, {}, unsafePolicy).allowed,
    false,
  )
})
