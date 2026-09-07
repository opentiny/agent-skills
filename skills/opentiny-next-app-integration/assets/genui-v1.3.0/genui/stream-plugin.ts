import type { ChatMessage, UseMessagePlugin } from '@opentiny/tiny-robot-kit'
import { createGenuiStreamParser } from './stream-parser.ts'

export interface GenuiTextPart {
  type: 'text'
  text: string
}

export interface GenuiSchemaCardPart {
  type: 'schema-card'
  content: string
}

export type GenuiMessagePart = GenuiTextPart | GenuiSchemaCardPart

interface GenuiMessageState extends Record<string, unknown> {
  genuiContent?: GenuiMessagePart[]
}

type GenuiChatMessage = ChatMessage & { state?: GenuiMessageState }

function getGenuiContent(message: GenuiChatMessage): GenuiMessagePart[] {
  message.state ??= {}
  message.state.genuiContent ??= []
  return message.state.genuiContent
}

function appendMarkdown(message: GenuiChatMessage, content: string): void {
  const parts = getGenuiContent(message)
  const lastPart = parts.at(-1)

  if (lastPart?.type === 'text') lastPart.text += content
  else parts.push({ type: 'text', text: content })
}

function appendSchemaCard(message: GenuiChatMessage, content: string): void {
  const parts = getGenuiContent(message)
  const lastPart = parts.at(-1)

  if (lastPart?.type === 'schema-card') lastPart.content += content
  else parts.push({ type: 'schema-card', content })
}

export function createGenuiSchemaStreamPlugin(isEnabled: () => boolean): UseMessagePlugin {
  let activeMessage: GenuiChatMessage | null = null
  const parser = createGenuiStreamParser({
    onMarkdown(content) {
      if (activeMessage) appendMarkdown(activeMessage, content)
    },
    onSchemaCard(content) {
      if (activeMessage) appendSchemaCard(activeMessage, content)
    },
  })

  return {
    name: 'genui-schema-stream',
    disabled: () => !isEnabled(),
    onTurnStart() {
      activeMessage = null
      parser.reset()
    },
    onCompletionChunk({ choice, currentMessage }) {
      const content = choice?.delta?.content
      if (typeof content !== 'string' || !content) return

      activeMessage = currentMessage as GenuiChatMessage
      parser.write(content)
    },
    onFinally() {
      parser.end()
      parser.reset()
      activeMessage = null
    },
  }
}
