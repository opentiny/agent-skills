import assert from 'node:assert/strict'
import { access, mkdir, mkdtemp, readFile, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { syncTinyRobotSkill } from './index'

async function write(root: string, relativePath: string, content: string) {
  const target = path.join(root, relativePath)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, content)
}

async function createFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'tiny-robot-skill-sync-'))
  const sourceRoot = path.join(root, 'tiny-robot')
  const skillRoot = path.join(root, 'skill')

  const docs: Record<string, string> = {
    'guide/quick-start.md': '# 快速开始\n',
    'guide/plugin-badge.md': '# VitePress badge plugin internals\n',
    'suites/quick-start.md':
      '# Chat 快速上手\n<demo\n  vue = "../../demos/chat/basic.vue"\n  :vueFiles = "[\'../../demos/chat/basic.vue\', \'../../demos/chat/helper.ts\']"\n/>\n',
    'components/layout.md': '# Layout 布局\n<demo vue="../../demos/layout/basic.vue" />\n',
    'components/container.md': '---\nbadge: deprecated\n---\n# Container 容器\n',
    'components/mcp-server-picker.md': '---\nbadge: deprecated\n---\n# McpServerPicker 插件选择器\n',
    'tools/conversation.md': '# useConversation 会话管理\n',
    'best-practices/extension-manager-integration.md': '# MCP 与 Skill 扩展管理\n',
    'migration/v1.0/container.md': '# Container 到 Layout\n',
    'examples/assistant.md': '# Assistant 综合示例\n',
  }

  for (const [relativePath, content] of Object.entries(docs)) {
    await write(sourceRoot, `docs/src/${relativePath}`, content)
  }

  await write(
    sourceRoot,
    'docs/demos/chat/basic.vue',
    '<script setup lang="ts">\nimport NestedBubble from \'./NestedBubble.vue\'\n</script>\n<template><NestedBubble /></template>\n',
  )
  await write(sourceRoot, 'docs/demos/chat/NestedBubble.vue', '<template>nested</template>\n')
  await write(
    sourceRoot,
    'docs/demos/chat/helper.ts',
    "import './helper.css'\nimport { messages } from './state.messages'\nexport const helper = messages.length === 0\n",
  )
  await write(sourceRoot, 'docs/demos/chat/helper.css', '.helper { background: url("./icon.svg"); }\n')
  await write(sourceRoot, 'docs/demos/chat/icon.svg', '<svg xmlns="http://www.w3.org/2000/svg" />\n')
  await write(sourceRoot, 'docs/demos/chat/state.messages.ts', 'export const messages = []\n')
  await write(sourceRoot, 'docs/demos/layout/basic.vue', '<template>layout</template>\n')
  await write(sourceRoot, 'docs/demos/layout/unreferenced.vue', '<template>unused</template>\n')
  await write(
    sourceRoot,
    'packages/components/src/index.ts',
    [
      "export { default as TrLayout } from './layout'",
      "export { LayoutProxyScrollbar as TrLayoutProxyScrollbar, LayoutAsideToggle as TrLayoutAsideToggle } from './layout'",
      "export { default as TrContainer } from './container'",
      "export { default as TrMcpServerPicker } from './mcp-server-picker'",
      "export { default as TrIconButton } from './icon-button'",
    ].join('\n'),
  )
  await write(
    sourceRoot,
    'packages/chat/src/index.ts',
    "export { default as TrChat } from './Chat.vue'\nexport { default as TrChatUI } from './ChatUI.vue'\n",
  )

  await write(skillRoot, 'SKILL.md', '# keep\n')
  await write(skillRoot, 'references/product-model.md', '# keep hand-authored\n')
  await write(skillRoot, '.claude-plugin/plugin.json', '{}\n')
  await write(skillRoot, 'scripts/helper.ts', 'export {}\n')
  await write(skillRoot, 'components/legacy.md', '# remove\n')
  await write(skillRoot, 'demos/legacy.vue', '<template />\n')
  await write(skillRoot, 'guide/legacy.md', '# remove\n')

  return { root, sourceRoot, skillRoot }
}

test('syncs the formal 1.0 snapshot and only referenced demos', async () => {
  const { skillRoot, sourceRoot } = await createFixture()

  const report = await syncTinyRobotSkill({
    sourceRoot,
    skillRoot,
    sourceRef: 'release/v1.0.x',
    sourceCommit: 'abc123',
  })

  assert.equal(report.documentsCopied, 9)
  assert.equal(report.demosCopied, 7)
  await access(path.join(skillRoot, 'references/docs/guide/quick-start.md'))
  await assert.rejects(access(path.join(skillRoot, 'references/docs/guide/plugin-badge.md')))
  await access(path.join(skillRoot, 'references/docs/suites/quick-start.md'))
  await access(path.join(skillRoot, 'references/docs/components/layout.md'))
  await access(path.join(skillRoot, 'references/docs/tools/conversation.md'))
  await access(path.join(skillRoot, 'references/docs/best-practices/extension-manager-integration.md'))
  await access(path.join(skillRoot, 'references/docs/migration/v1.0/container.md'))
  await access(path.join(skillRoot, 'references/docs/examples/assistant.md'))
  await access(path.join(skillRoot, 'examples/demos/chat/basic.vue'))
  await access(path.join(skillRoot, 'examples/demos/chat/helper.ts'))
  await access(path.join(skillRoot, 'examples/demos/chat/NestedBubble.vue'))
  await access(path.join(skillRoot, 'examples/demos/chat/helper.css'))
  await access(path.join(skillRoot, 'examples/demos/chat/icon.svg'))
  await access(path.join(skillRoot, 'examples/demos/chat/state.messages.ts'))
  await access(path.join(skillRoot, 'examples/demos/layout/basic.vue'))
  await assert.rejects(access(path.join(skillRoot, 'examples/demos/layout/unreferenced.vue')))

  const index = JSON.parse(await readFile(path.join(skillRoot, 'component-index.json'), 'utf8'))
  assert.equal(index.schemaVersion, 1)
  assert.equal(index.tinyRobotVersion, '1.0.x')
  assert.deepEqual(index.source, { ref: 'release/v1.0.x', commit: 'abc123' })
  assert.equal(index.entries.find((entry: { id: string }) => entry.id === 'layout').status, 'stable')
  assert.equal(index.entries.find((entry: { id: string }) => entry.id === 'layout').proactive, true)
  assert.equal(index.entries.find((entry: { id: string }) => entry.id === 'container').status, 'deprecated')
  assert.deepEqual(index.entries.find((entry: { id: string }) => entry.id === 'container').replacedBy, ['layout'])
  assert.deepEqual(index.entries.find((entry: { id: string }) => entry.id === 'mcp-server-picker').replacedBy, [
    'extension-manager',
  ])
  assert.equal(index.entries.some((entry: { id: string }) => entry.id === 'icon-button'), false)
  for (const entry of index.entries) {
    assert.equal(
      new Set(entry.names.map((name: string) => name.toLocaleLowerCase())).size,
      entry.names.length,
      `${entry.id} aliases are unique`,
    )
  }
  const snapshot = JSON.parse(await readFile(path.join(skillRoot, 'references/docs/.snapshot.json'), 'utf8'))
  assert.deepEqual(snapshot, {
    tinyRobotVersion: '1.0.x',
    source: { ref: 'release/v1.0.x', commit: 'abc123' },
    documents: 9,
    demos: 7,
  })

  assert.equal(await readFile(path.join(skillRoot, 'SKILL.md'), 'utf8'), '# keep\n')
  assert.equal(await readFile(path.join(skillRoot, 'references/product-model.md'), 'utf8'), '# keep hand-authored\n')
  await access(path.join(skillRoot, '.claude-plugin/plugin.json'))
  await access(path.join(skillRoot, 'scripts/helper.ts'))
  await assert.rejects(access(path.join(skillRoot, 'components/legacy.md')))
  await assert.rejects(access(path.join(skillRoot, 'demos/legacy.vue')))
  await assert.rejects(access(path.join(skillRoot, 'guide/legacy.md')))
})

test('rejects demo references that escape the TinyRobot docs tree', async () => {
  const { skillRoot, sourceRoot } = await createFixture()
  await write(sourceRoot, 'docs/src/components/escape.md', '# Escape\n<demo vue="../../../outside.vue" />\n')
  await write(sourceRoot, 'outside.vue', '<template>outside</template>\n')

  await assert.rejects(
    syncTinyRobotSkill({
      sourceRoot,
      skillRoot,
      sourceRef: 'release/v1.0.x',
      sourceCommit: 'abc123',
    }),
    /escapes docs root/,
  )
})

test('rejects demo symlinks whose real target escapes the demos tree', async () => {
  const { root, skillRoot, sourceRoot } = await createFixture()
  const outsidePath = path.join(root, 'outside.vue')
  await writeFile(outsidePath, '<template>outside</template>\n')
  await symlink(outsidePath, path.join(sourceRoot, 'docs/demos/layout/linked.vue'))
  await write(
    sourceRoot,
    'docs/src/examples/linked.md',
    '# Linked\n<demo vue="../../demos/layout/linked.vue" />\n',
  )

  await assert.rejects(
    syncTinyRobotSkill({
      sourceRoot,
      skillRoot,
      sourceRef: 'release/v1.0.x',
      sourceCommit: 'abc123',
    }),
    /symlink|escapes demos root/,
  )
})

test('rejects a docs/demos root that is itself a symlink', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'tiny-robot-skill-sync-root-link-'))
  const sourceRoot = path.join(root, 'tiny-robot')
  const skillRoot = path.join(root, 'skill')
  const externalDemos = path.join(root, 'external-demos')
  await write(sourceRoot, 'docs/src/guide/linked.md', '# Linked\n<demo vue="../../demos/basic.vue" />\n')
  await write(externalDemos, 'basic.vue', '<template>outside</template>\n')
  await symlink(externalDemos, path.join(sourceRoot, 'docs/demos'), 'dir')

  await assert.rejects(
    syncTinyRobotSkill({
      sourceRoot,
      skillRoot,
      sourceRef: 'release/v1.0.x',
      sourceCommit: 'abc123',
    }),
    /demos root must not be a symlink|escapes docs root/,
  )
})

test('rejects documented exports that are absent from package roots', async () => {
  const { skillRoot, sourceRoot } = await createFixture()
  await write(
    sourceRoot,
    'packages/components/src/index.ts',
    [
      "export { LayoutProxyScrollbar as TrLayoutProxyScrollbar, LayoutAsideToggle as TrLayoutAsideToggle } from './layout'",
      "export { default as TrContainer } from './container'",
      "export { default as TrMcpServerPicker } from './mcp-server-picker'",
      "export { default as TrIconButton } from './icon-button'",
    ].join('\n'),
  )

  await assert.rejects(
    syncTinyRobotSkill({
      sourceRoot,
      skillRoot,
      sourceRef: 'release/v1.0.x',
      sourceCommit: 'abc123',
    }),
    /documented export not found in package roots: TrLayout/,
  )
})
