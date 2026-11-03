# TinyRobot product model

## Outcome

Assign each application responsibility to one TinyRobot layer before choosing individual APIs.

## Package ownership

| Layer | Package | Owns | Does not own |
| --- | --- | --- | --- |
| Chat suite | `@opentiny/tiny-robot-chat` | Complete chat page/UI, Chat Runtime wiring, conversation/message/composer integration | The application's authentication, authorization, durable backend, or secret storage |
| UI components | `@opentiny/tiny-robot` | Reusable chat UI regions such as Layout, Bubble, Sender, History, ModelSelector, and extension UI | Model requests, durable extension installation, or application data persistence |
| State toolkit | `@opentiny/tiny-robot-kit` | Message/request state, response consumption, tool-call coordination, conversations, and storage strategies | Rendering the application's UI |

`@opentiny/tiny-robot-chat` composes the other concerns into a product-level chat experience. Its presence is not interchangeable with the components package.

## State ownership

- `TrChat` receives a Chat Runtime; `useChatRuntime` is the default owner of its chat behavior.
- `TrChatUI` receives display state and callbacks from the application when the application already owns the data layer.
- `useMessage` owns one message flow and request state. Tool execution, approval, permissions, and side effects remain application responsibilities.
- `useConversation` owns a collection of conversations and one message engine per conversation. A configured storage strategy persists them.
- UI components may keep local presentation state documented for that component. Events do not imply that the component persisted or mutated the application's source data.

## Persistence defaults

Application-owned storage policies do not imply that the library has no default browser persistence. Check both the selected layer and the underlying Kit contract:

- [`useConversation`](docs/tools/conversation.md) defaults to LocalStorage when `storage` is omitted, but its `autoSaveMessages` defaults to `false`. Automatic message saving must be enabled or messages explicitly saved.
- [`useChatRuntime`](docs/suites/chat-runtime.md#usechatruntime-配置) defaults `conversation.autoSaveMessages` to `true` and retains the default storage strategy. Its default setup therefore already supports browser-local conversation persistence; do not claim that omitting `conversation.storage` prevents refresh restoration.
- Account isolation, cross-device synchronization, backend storage, and extension installation persistence remain application responsibilities. Reusing an existing Kit conversation preserves its configuration; do not transfer the default of one composable to another.

## Extension architecture

Used directly, `ExtensionManager` is the generic browse/filter/section/action surface. MCP and Skill form/detail components provide specialized UI. The host application loads and normalizes extension data, handles install/uninstall/enable/disable/navigation events, persists results, and hosts forms/details in its chosen page, Dialog, or Drawer.

Read `references/docs/best-practices/extension-manager-integration.md` for the documented composition.

## Chat event ownership

Choose the component first; shared `ui` configuration and slots do not make its events or application responsibilities interchangeable.

| Surface | TinyRobot provides | Application provides |
| --- | --- | --- |
| [`TrChat`](docs/suites/chat.md#trchat-events) | Chat UI, the built-in MCP form and validation, and Runtime handling of built-in chat/model/known-MCP operations; those UI operation events are not re-emitted | Handle the validated `mcp-create-server` result, save configuration and integrate it into the chosen runtime/data source; handle custom extension actions |
| [`TrChatUI`](docs/suites/chat.md#trchatui-events) | The same built-in MCP form and validation; operation requests emitted to the host | Handle operations such as MCP add/remove/enable, update `data`, and save application state |
| Standalone `ExtensionManager` | Generic management display and action events | Supply data, handle operations, host the specialized form/detail UI, and persist results |

For both Chat components, [`mcp-create-server`](docs/suites/chat.md#chatuidata-mcp) fires **after** the built-in form validates, with `{ config, source }` (`source: 'form' | 'code'`). Receiving this event is not a request to render a form. A replacement form is an optional customization. [Runtime `addServer(id)`](docs/suites/chat-runtime.md#状态与方法) installs an already known service; it does not establish a public API for registering a new configuration. Verify the application's chosen integration path instead of inventing a registration method or assuming mutation of the initial configuration is reactive.

## 1.0 replacements

- `Container` is deprecated: use `Layout` for new page, embedded, or floating layouts.
- `McpServerPicker` is deprecated: use `ExtensionManager` plus the required MCP/Skill specialized components and application-owned operations.

Use the migration documents for behavior mapping; do not perform a name-only replacement.
