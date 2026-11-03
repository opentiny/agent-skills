# Capability selection

## Outcome

Select the smallest layer that still owns the requested end-to-end behavior.

## Decision recipe

1. **Complete chat surface?** Start with the Chat suite: `TrChat` when TinyRobot provides runtime behavior; `TrChatUI` when the application supplies display state and handles actions.
2. **One UI region in an existing product?** Choose the indexed component from `@opentiny/tiny-robot`.
3. **Only message, request, conversation, or persistence logic?** Choose Kit: `useMessage` for one AI message flow; `useConversation` for multiple conversations, switching, restoration, or storage.
4. **Extension management?** Use ExtensionManager as the common surface, then add only the documented MCP/Skill forms or details required by the workflow.
5. Confirm the choice against `component-index.json`; load the entry's formal doc and referenced demo.

Do not choose a lower-level composition merely because it is possible. Choose it when the application genuinely needs to own the connections between regions.

## Complete decision example

Requirement: build a complete chat application, but add attachments, suggestions, and a custom action to the composer.

1. Select `@opentiny/tiny-robot-chat`, `TrChat`, and `useChatRuntime` because the result is still a complete chat application.
2. Read `references/docs/suites/quick-start.md` and the input-area section of `references/docs/suites/chat.md`.
3. Configure `ui.sender`, its extensions/toolbar, and the documented Sender-related Chat slots.
4. Read the Sender component doc only for the specific extension contracts used by the Chat configuration.
5. Fall back to a manual Layout/Bubble/Sender composition only if a required application-owned interaction cannot be expressed by documented Chat configuration or slots. State that reason.

## Selection output

State the selected layer/package, why it owns the outcome, any missing required dependency, the exact index/docs evidence, and the application responsibilities outside TinyRobot. Stop and use `versioning.md` if required installed TinyRobot packages are not aligned.
