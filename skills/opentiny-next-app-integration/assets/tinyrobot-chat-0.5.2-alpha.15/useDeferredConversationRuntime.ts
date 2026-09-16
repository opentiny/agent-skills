import type { ChatRuntime } from '@opentiny/tiny-robot-chat'
import { computed, shallowRef } from 'vue'

export function useDeferredConversationRuntime() {
  const isDeferred = shallowRef(false)

  return {
    wrap(baseRuntime: ChatRuntime): ChatRuntime {
      return {
        conversations: baseRuntime.conversations,
        activeConversation: computed(() => (isDeferred.value ? null : baseRuntime.activeConversation.value)),
        composer: baseRuntime.composer,
        actions: {
          ...baseRuntime.actions,
          createConversation(): void {
            isDeferred.value = true
          },
          async switchConversation(id: string): Promise<void> {
            isDeferred.value = false
            await baseRuntime.actions.switchConversation(id)
          },
        },
      }
    },
    async commit(createConversation: () => Promise<void> | void): Promise<void> {
      if (!isDeferred.value) return
      await createConversation()
      isDeferred.value = false
    },
  }
}
