---
name: tiny-robot-skill
description: Use when an application developer builds, integrates, migrates, troubleshoots, or reviews a Vue application that uses TinyRobot 1.0, including @opentiny/tiny-robot-chat, @opentiny/tiny-robot, @opentiny/tiny-robot-kit, TrChat, chat UI components, message or conversation state, and MCP or Skill extensions; not for TinyRobot library maintenance or unrelated Vue UI.
license: MIT
metadata:
  author: opentiny
  version: '1.0.0'
---

# TinyRobot 1.0 Application Development

Help application developers use TinyRobot without guessing package ownership or public APIs. The bundled snapshot targets `release/v1.0.x`; consumer-project evidence still takes precedence.

Before recommending or running a TinyRobot installation, read `distTag` from [install-config.json](install-config.json), the single source for the default npm channel. Form each requested package as `<package>@<distTag>` and output concrete commands with that value substituted. See [setup.md](references/setup.md#installation-channel) for recipes. A user-requested version takes precedence; existing dependencies are not automatically upgraded.

## Start with the consumer project

Before recommending imports or generating version-sensitive code:

1. Inspect `package.json`, the lockfile, and installed package metadata when available.
2. Identify the TinyRobot packages required by this task, then record which are installed and their resolved versions.
3. If a required package is absent, say which dependency must be added. Never claim it is already installed.
4. Check required packages against their published dependency/peer ranges and the supported 1.0 stable or RC line; exact version equality is not the compatibility test. If compatibility is unresolved, stop target-version-sensitive generation and follow [versioning.md](references/versioning.md). For an explicit migration, still analyze the source version and map it to the 1.0 target before target dependencies are changed.

## Choose the highest useful layer

Use this order; do not start by assembling primitives:

1. **Complete chat application:** use `@opentiny/tiny-robot-chat` with `TrChat` and `useChatRuntime`.
2. **Complete chat UI with an existing data layer:** use `TrChatUI`, or connect existing Kit conversations with `useChatRuntimeFromConversation` when its documented contract fits.
3. **One UI region or a deliberately custom composition:** use components from `@opentiny/tiny-robot`, such as Sender, Bubble, Layout, or ExtensionManager.
4. **State and model-request logic without TinyRobot UI:** use `@opentiny/tiny-robot-kit`; choose `useMessage` for one message flow and `useConversation` for multiple conversations and persistence.

For a complete Chat page with a customized composer, try `ui.sender`, toolbar configuration, and Chat slots first. Local customization alone is not a reason to rebuild the whole page from primitives.

Read [product-model.md](references/product-model.md) for ownership and [selection.md](references/selection.md) for the full decision recipe.

## Establish API evidence

For every component, composable, prop, event, slot, or type:

1. Search [component-index.json](component-index.json) by name, alias, scene, or package.
2. Read the entry's `doc` and only the demos listed in its `demos` array.
3. When editing a consumer repository, confirm the installed package's root exports and type declarations.
4. Prefer installed declarations over this snapshot when they disagree; report the discrepancy.

Only entries with `proactive: true` are supported for proactive recommendation. A package-root export absent from the index is query-only evidence: when explicitly asked, inspect its installed declarations and say that formal application documentation/support status is unconfirmed. Never infer an API from its name.

## Route the task

| Task | Read |
| --- | --- |
| Package/layer choice, Chat versus primitives | [selection.md](references/selection.md) |
| Install, styles, project integration | [setup.md](references/setup.md) |
| Generate or change application code | [implementation.md](references/implementation.md) |
| Diagnose runtime, type, layout, or request problems | [troubleshooting.md](references/troubleshooting.md) |
| Review TinyRobot application code | [review.md](references/review.md) |
| Mixed versions, snapshot drift, or migration | [versioning.md](references/versioning.md) |

Load only the routed reference plus the exact indexed docs and demos it names.

## Defaults and stopping conditions

- New 1.0 work uses `Layout`, not deprecated `Container`.
- New extension management uses `ExtensionManager`, not deprecated `McpServerPicker`.
- Standalone ExtensionManager presents and emits actions; the application owns operations and hosting its forms/details. Chat already hosts its MCP form, validates it, then emits `mcp-create-server`; follow [product-model.md](references/product-model.md) for UI, Runtime, and persistence ownership.
- Production model credentials stay on a server-side boundary; browser-side keys are only for local temporary experiments.
- If evidence does not establish an API, state what was checked and leave the API unconfirmed. Do not produce plausible code.
- Do not activate this skill for ordinary Vue UI that does not use TinyRobot.
