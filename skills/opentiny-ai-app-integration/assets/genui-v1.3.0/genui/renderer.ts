import {
  BubbleRendererMatchPriority,
  useMessageContent,
  type BubbleContentRendererMatch,
  type BubbleContentRendererProps,
} from '@opentiny/tiny-robot'
import { defineAsyncComponent, h, type ComputedRef } from 'vue'

const GenuiRenderer = defineAsyncComponent(() =>
  import('@opentiny/genui-sdk-vue/renderer').then((module) => module.GenuiRenderer),
)

interface SchemaCardContent {
  type: 'schema-card'
  content: string
}

export function createGenuiRendererMatch(isGenerating: ComputedRef<boolean>): BubbleContentRendererMatch {
  return {
    find: (_, content) => content.type === 'schema-card',
    renderer: (props: BubbleContentRendererProps) => {
      const { content } = useMessageContent(props)
      const schemaCard = content.value as SchemaCardContent

      return h(GenuiRenderer, {
        content: schemaCard.content,
        generating: isGenerating.value,
      })
    },
    priority: BubbleRendererMatchPriority.CONTENT,
  }
}
