import { NodeViewContent, type NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { NodeSelection } from '@tiptap/pm/state'
import { type JSX } from 'react';
export const HeadRender: React.FC<NodeViewProps> = (props) => {
  
  const { class: className } = props.extension.options.HTMLAttributes;
  const { level } = props.node.attrs
  const content = props.node.content.firstChild?.text;
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const icon = props.node.attrs.collapsed ? '▶' : '▼'
  const onToggle = () => {
    const pos = typeof props.getPos === 'function' ? props.getPos() : props.getPos
    const { view } = props.editor
    const { doc } = view.state
    const node = doc.nodeAt(pos)
    if (!node) return
    const collapsed = !node.attrs.collapsed
    const tr = view.state.tr
    tr.setNodeMarkup(pos, undefined, { ...node.attrs, collapsed })
    view.dispatch(tr)
  }
  return (
    <NodeViewWrapper>
      <div id={content} style={{ display: 'flex', alignItems: 'center' }}>
        <span onClick={onToggle} style={{ marginRight: 6, cursor: 'pointer', userSelect: 'none', fontSize: 12 }}>{icon}</span>
        <Tag className={className}>{<NodeViewContent/>}</Tag>
      </div>
    </NodeViewWrapper>
  )
}