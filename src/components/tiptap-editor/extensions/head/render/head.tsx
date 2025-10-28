import { NodeViewContent, type NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { type JSX } from 'react';
export const HeadRender: React.FC<NodeViewProps> = (props) => {
  
  const { class: className } = props.extension.options.HTMLAttributes;
  const { level } = props.node.attrs
  const content = props.node.content.firstChild?.text;
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <NodeViewWrapper>
      <div id={content}>
        <Tag className={className}>{<NodeViewContent/>}</Tag>
      </div>
    </NodeViewWrapper>
  )
}