import { NodeViewContent, type NodeViewProps, NodeViewWrapper } from '@tiptap/react';
// import { RenderHighLightCode } from './code-block';
import { RenderMermaid } from './mermaid';
import { useMemo } from 'react';

export const RenderCodeBlock: React.FC<NodeViewProps> = (props) => {
  const { node } = props
  const { language } = node.attrs;
  const content = node.textContent;
  const decodeURIContent = useMemo(() => {
    return decodeURIComponent(content)
  }, [content])
  const renderer = useMemo(() => {
    if(language === 'mermaid') {
      return <RenderMermaid value={decodeURIContent} />
    } else {
      return (
        <pre>
          { /* @ts-ignore */}
          <NodeViewContent as={'code'}/>
        </pre>
      )
    }
  }, [])
  
  return <NodeViewWrapper>
    {renderer}
  </NodeViewWrapper>
};