import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

// 初始化 mermaid 配置
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  suppressErrorRendering: true
})

let mermaidId = 0

export const RenderMermaid = ({ value }: { value?: string })=> {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')
  const idRef = useRef(`mermaid-${mermaidId++}`)

  useEffect(() => {
    if (!value) return

    const renderMermaid = async () => {
      try {
        setError('')
        const { svg } = await mermaid.render(idRef.current, value)
        setSvg(svg)
      } catch (err) {
        console.error('Mermaid render error:', err)
        setError(err instanceof Error ? err.message : 'Mermaid 渲染失败')
      }
    }

    renderMermaid()
  }, [value])

  if (error) {
    return (
      <div className='p-4 mb-4 rounded-lg bg-red-50 text-red-600 text-sm'>
        <div className='font-semibold mb-1'>Mermaid 渲染错误：</div>
        <div>{error}</div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className='mermaid-container'
      contentEditable={false}
      style={{
        userSelect: 'none',
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
