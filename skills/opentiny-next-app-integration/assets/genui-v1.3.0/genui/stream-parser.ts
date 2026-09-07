import { PatternExtractor } from '@opentiny/genui-sdk-core'

export interface GenuiStreamParserOptions {
  onMarkdown: (content: string) => void
  onSchemaCard: (content: string) => void
}

export interface GenuiStreamParser {
  write: (content: string) => void
  end: () => void
  reset: () => void
}

export function createGenuiStreamParser(options: GenuiStreamParserOptions): GenuiStreamParser {
  const extractor = new PatternExtractor({
    onNormalWrite: options.onMarkdown,
    onHandledWrite: options.onSchemaCard,
  })

  return {
    write(content) {
      if (content) extractor.handleContent(content)
    },
    end() {},
    reset() {
      extractor.reset()
    },
  }
}
