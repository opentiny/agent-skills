<script setup lang="ts">
import { IconSparkles } from '@opentiny/tiny-robot-svgs'

const props = defineProps<{
  enabled: boolean
  available: boolean
}>()

const emit = defineEmits<{
  toggle: [enabled: boolean]
}>()
</script>

<template>
  <button
    class="chat-genui-switch"
    type="button"
    :disabled="!props.available"
    :aria-pressed="props.enabled"
    aria-label="GenUI"
    :title="props.available ? '切换生成式 UI' : '请先配置 VITE_GENUI_URL 和 VITE_GENUI_PROMPT_ID'"
    @click="emit('toggle', !props.enabled)"
  >
    <IconSparkles :size="16" class="chat-genui-switch__icon" />
    <span class="chat-genui-switch__label">GenUI</span>
  </button>
</template>

<style scoped>
.chat-genui-switch {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--tr-border-color-disabled);
  border-radius: var(--tr-radius-full);
  color: var(--tr-text-secondary);
  background: var(--tr-container-bg-default);
  font: inherit;
  font-size: var(--tr-font-size-sm);
  line-height: 1;
  cursor: pointer;
}
.chat-genui-switch:hover:not(:disabled) {
  border-color: var(--tr-border-color-hover);
  background: var(--tr-container-bg-hover);
}
.chat-genui-switch[aria-pressed='true'] {
  border-color: var(--tr-border-color-hover);
  color: var(--tr-border-color-hover);
  background: var(--tr-container-bg-default-2);
}
.chat-genui-switch:focus-visible {
  outline: 2px solid var(--tr-border-color-hover);
  outline-offset: 1px;
}
.chat-genui-switch:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.chat-genui-switch__icon {
  flex-shrink: 0;
  font-size: 16px;
}
@container (max-width: 959px) {
  .chat-genui-switch {
    justify-content: center;
    width: 32px;
    padding: 0;
  }
  .chat-genui-switch__label {
    display: none;
  }
}
</style>
