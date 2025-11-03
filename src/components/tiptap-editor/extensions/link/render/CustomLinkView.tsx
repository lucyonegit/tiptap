import React from 'react'
import { MarkViewContent } from '@tiptap/react'
import type { MarkViewRendererProps } from '@tiptap/react'
// 简化版链接渲染：移除外部依赖，点击打开新窗口

const CustomLinkView: React.FC<MarkViewRendererProps> = props => {
  const { HTMLAttributes } = props
  const { class: className, href, title } = HTMLAttributes as {
    href: string
    title: string | null
    target: string | null
    rel: string | null
    class: string
  }

  const anchor = (
    <span
      className={`px-[2px] text-[15px] text-[#3F3F44] mr-[3px] text-[#3F3F44] border-b border-b-[1px] border-b-dashed border-b-[#626999B3]  hover:bg-[#6269991A] cursor-pointer py-[2px] ${className}`}
      title={title||''}
      onClick={() => {
        if (href) {
          window.open(href, '_blank')
        }
      }}
    >
      <MarkViewContent />
    </span>
  )
  if (!title) {
    return anchor
  }
  return anchor
}

export default CustomLinkView
