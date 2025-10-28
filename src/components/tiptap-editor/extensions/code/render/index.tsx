import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { RenderHighLightCode } from './code-block';
import { RenderMermaid } from './mermaid';
import { useMemo } from 'react';

export const RenderCodeBlock: React.FC<NodeViewProps> = (props) => {
  const { HTMLAttributes } = props
  const { language, content } = HTMLAttributes
  const decodeURIContent = useMemo(() => {
    return decodeURIComponent(content)
  }, [content])
  const renderer = useMemo(() => {
    if(language === 'mermaid') {
      return <RenderMermaid value={decodeURIContent} />
    } else {
      return <RenderHighLightCode language={language} content={decodeURIContent} />
    }
  }, [])
  
  return <NodeViewWrapper>
    {renderer}
  </NodeViewWrapper>
};