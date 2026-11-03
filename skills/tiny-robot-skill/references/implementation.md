# Application implementation

## Outcome

Produce application code whose imports and behavior are supported by the consumer's installed TinyRobot version and formal 1.0 evidence.

## Evidence order

1. Consumer code and installed package versions.
2. Matching entry in `component-index.json`.
3. Entry `doc`, then only the relevant listed `demos`.
4. Installed root exports and type declarations for exact names and signatures.

## Workflow

1. Use `selection.md` to choose Chat, UI components, or Kit.
2. List the public imports and contracts the change requires.
3. Verify every prop, event, slot, method, option, and type in the evidence order.
   Check documented defaults before claiming that behavior is absent or requires extra configuration. For composed behavior such as Chat conversation persistence, read both the suite contract and the underlying Kit contract; use `product-model.md` to distinguish built-in defaults from application storage policies.
4. Reuse the closest documented demo structure, adapting business data rather than copying documentation-site wrappers.
5. Keep data ownership visible: props flow into UI; emitted actions update application state; asynchronous failures have an observable path.
6. Preserve the consumer's language, framework, formatting, tests, and component conventions.
7. Run its focused typecheck/test/build command.

## Complete Chat implementation recipe

1. Start with the complete `TrChat` and `useChatRuntime` example in [suite quick start](docs/suites/quick-start.md), replacing only the service configuration and business data required by the task.
2. Read the selected component's event table: [`TrChat`](docs/suites/chat.md#trchat-events) delegates built-in operations to Runtime, while [`TrChatUI`](docs/suites/chat.md#trchatui-events) requires application handlers. State which component each proposed handler belongs to, including MCP operations; see `product-model.md` for ownership.
3. Keep the default UI when it already supplies the requested conversation, message, input, model, and MCP controls. Configure only the requested differences; model and MCP data do not by themselves require a toolbar override.
4. For an actual toolbar customization, read the full [`sender.toolbar` contract](docs/suites/chat.md#sender-toolbar). Retain the documented discriminator and required fields: a built-in entry is `{ type: 'builtin', id: 'model' }`, while a custom entry needs `type: 'custom'`, a non-reserved `id`, `label`, and `onClick`. An outer option name does not establish a nested object's shape; copy the documented shape rather than inventing a shorthand.
5. Follow each service's own URL contract. The [model provider](docs/suites/chat-runtime.md#模型服务) documents a complete `apiUrl`; same-origin model proxies can use `new URL('/api/ai/v1/chat/completions', window.location.origin).href`. MCP `baseUrl` explicitly permits relative addresses, which is not evidence for the model option.

## Code boundaries

- Prefer Chat `ui` options and slots for local customization of a complete chat page.
- Use `Layout` for new layout code.
- Treat ExtensionManager action events as requests for the application to update data; do not assume automatic mutation or persistence.
- Use `useMessage` with a documented `responseProvider` for a single flow. Use `useConversation` when conversation lifecycle or persistence is required.
- Do not invent convenience wrappers, default values, or undocumented two-way bindings.
- A demo proves the pattern shown, not unrelated APIs.

## Output

Return the selected package/layer and evidence, the smallest documented example satisfying the request, then the required service/business prerequisites and unresolved contracts. Use built-in defaults where they cover the requested behavior. Include feature-specific customization instructions when that feature is part of the task; leave unrelated extensions for follow-up. Report actual validation results. If an API remains unconfirmed, omit that code and state the unresolved contract.
