import { useSmoothStream } from '@/pages/next-agent/hooks/useSmoothStream'
import { Markdown } from '@bty/components'
import { get } from 'http'
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

const MARKDOWN_OVERRIDES = {
  root: '[&>:only-child]:!m-0',
}

export interface StreamMarkdownContentRef {
  getContent: () => string
}

const StreamMarkdownContent = forwardRef<
  StreamMarkdownContentRef,
  { content?: string; streamDone?: boolean }
>(({ content, streamDone }, ref) => {
  const [displayedContent, setDisplayedContent] = useState<string>()

  const _content = content?.trim()

  const { addChunk } = useSmoothStream({
    streamDone,
    initialText: streamDone ? _content : '',
    onUpdate: setDisplayedContent,
  })

  useImperativeHandle(ref, () => ({
    getContent: () => displayedContent || '',
  }))

  useEffect(() => {
    if (!streamDone && _content) {
      addChunk(_content)
    }
  }, [_content, streamDone])

  if (!_content) {
    return null
  }

  return <Markdown content={displayedContent} overrides={MARKDOWN_OVERRIDES} />
})

export const StreamContent = memo(StreamMarkdownContent)
