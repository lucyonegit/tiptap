import React, { useRef, useState } from 'react'
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react'
import './TableView.css'

const CopyIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
      <path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
    </svg>
  )
}

// 提取表格数据为HTML格式
const extractTableDataAsHTML = (tableElement: HTMLElement): string => {
  // 克隆表格元素以避免修改原始DOM
  const clonedTable = tableElement.cloneNode(true) as HTMLElement

  // 移除复制按钮（如果存在）
  const copyButton = clonedTable.querySelector('button')
  if (copyButton) {
    copyButton.remove()
  }

  // 返回完整的HTML表格
  return clonedTable.outerHTML
}

// 提取表格数据为制表符分隔的文本格式（用于Excel等）
const extractTableDataAsText = (tableElement: HTMLElement): string => {
  const rows: string[] = []

  // 获取所有行
  const tableRows = tableElement.querySelectorAll('tr')

  tableRows.forEach(row => {
    const cells: string[] = []
    const tableCells = row.querySelectorAll('th, td')

    tableCells.forEach(cell => {
      // 获取单元格文本内容，去除多余空白
      const text = cell.textContent?.trim() || ''
      cells.push(text)
    })

    // 用制表符分隔单元格
    rows.push(cells.join('\t'))
  })

  // 用换行符分隔行
  return rows.join('\n')
}

// 复制到剪贴板（支持HTML和纯文本格式）
async function copyToClipboard(
  htmlData: string,
  textData: string,
): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // 使用现代 Clipboard API，支持多种格式
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlData], { type: 'text/html' }),
        'text/plain': new Blob([textData], { type: 'text/plain' }),
      })
      await navigator.clipboard.write([clipboardItem])
      return true
    } else {
      // 降级方案：只复制纯文本
      const textArea = document.createElement('textarea')
      textArea.value = textData
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      return result
    }
  } catch (err) {
    console.error('复制失败:', err)
    return false
  }
}

export const TableView: React.FC<NodeViewProps> = props => {
  const HTMLAttributes = props.extension.options.HTMLAttributes
  const tableRef = useRef<HTMLTableElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (tableRef.current) {
      const tableElement = document.createElement('table')
      const tbody = document.createElement('tbody')
      tableElement.appendChild(tbody)
      const clone = tableRef.current.cloneNode(true)
      tbody.append(...clone.firstChild?.firstChild?.childNodes!)
      const tableHtml = extractTableDataAsHTML(tableElement)
      const tableText = extractTableDataAsText(tableElement)
      const success = await copyToClipboard(tableHtml, tableText)
      if (success) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // 2秒后重置状态
      }
    }
  }

  return (
    <NodeViewWrapper className={HTMLAttributes.class || 'editor-table'}>
      <div style={{ position: 'relative' }} className='group'>
        <div
          onClick={handleCopy}
          className='w-[28px] h-[28px] absolute top-[2px] right-[2px] opacity-0 group-hover:opacity-100 z-[10000] rounded-[4px] flex flex-row justify-center items-center bg-white border border-[#DDD] shadow-sm transition-all duration-200 cursor-pointer'
          title={copied ? '已复制!' : '复制表格'}
        >
          {copied ? (
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-green-600'
            >
              <polyline points='20,6 9,17 4,12' />
            </svg>
          ) : (
            <CopyIcon className='text-gray-600 hover:text-gray-800' />
          )}
        </div>
        <table ref={tableRef} style={{ width: '100%' }}>
          <NodeViewContent as={'tbody' as any} />
        </table>
      </div>
    </NodeViewWrapper>
  )
}
