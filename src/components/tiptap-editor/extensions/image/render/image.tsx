import { NodeViewWrapper , type NodeViewProps} from '@tiptap/react'
export const ImageRender: React.FC<NodeViewProps> = (props) => {
  const { src, alt } = props.HTMLAttributes
  const { class: className } = props.extension.options.HTMLAttributes;

  return (
    <NodeViewWrapper>
      <div className='editor-image'>
        <img src={src} alt={alt || ''} className={className} />
      </div>
      
    </NodeViewWrapper>
  )
}