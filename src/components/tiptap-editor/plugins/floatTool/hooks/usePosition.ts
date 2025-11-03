import { useEffect, useState } from 'react'
import { useEditor } from '../../../contexts/EditorContext';

export const usePostion = (
  setVisible: any,
  toolbarRef: any,
  visible: boolean,
) => {
  const { editor } = useEditor()
  const [position, setPosition] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  })
  const getCaretRect = (
    pos: number,
  ): { rect: DOMRect | null; lineHeight: number } => {
    if (!editor) return { rect: null, lineHeight: 16 }
    try {
      const { node, offset } = editor.view.domAtPos(pos)
      const range = document.createRange()
      let elForLine: Element | null = null
      if (node.nodeType === Node.TEXT_NODE) {
        const textNode = node as Text
        range.setStart(textNode, Math.min(offset, textNode.data.length))
        elForLine = textNode.parentElement
      } else {
        const el = node as Element
        const childCount = el.childNodes.length
        range.setStart(el, Math.min(offset, childCount))
        elForLine = el as Element
      }
      range.collapse(true)
      const rect = range.getBoundingClientRect()
      const cs = elForLine ? window.getComputedStyle(elForLine) : null
      const lh = cs ? parseFloat(cs.lineHeight || '16') : 16
      return {
        rect: rect.width || rect.height ? rect : null,
        lineHeight: isNaN(lh) ? 16 : lh,
      }
    } catch {
      return { rect: null, lineHeight: 16 }
    }
  }

  const getContainerRect = (): DOMRect => {
    const contentRoot = editor?.view.dom as HTMLElement | null
    const wrapper = contentRoot?.closest('.tiptap-editor')
      ?.parentElement as HTMLElement | null
    return (wrapper ?? contentRoot)?.getBoundingClientRect() as DOMRect
  }

  const updatePositionFromSelection = () => {
    if (!editor) return
    const sel = editor.state.selection as any
    const { anchor, head } = sel
    if (anchor === head) {
      setVisible(false)
      return
    }

    const isForward = anchor <= head
    const endPos = head
    const toolbarW = toolbarRef.current?.offsetWidth ?? 380
    const toolbarH = toolbarRef.current?.offsetHeight ?? 36
    const pad = 10

    const { rect: caretRect, lineHeight } = getCaretRect(endPos)
    const fallback = editor.view.coordsAtPos(endPos)
    const containerRect = getContainerRect()
    let left = caretRect
      ? caretRect.right - toolbarW / 2 - containerRect.left
      : fallback.right - toolbarW / 2 - containerRect.left

    // 动态间隔：行高的 0.5，至少 14px，保证不遮挡
    const gap = Math.max(14, Math.round(lineHeight * 0.5))

    let top =
      (caretRect ? caretRect.bottom : fallback.bottom) - containerRect.top + gap
    if (!isForward) {
      const toolbarH = toolbarRef.current?.offsetHeight ?? 38
      top =
        (caretRect ? caretRect.top : fallback.top) -
        containerRect.top -
        toolbarH -
        gap
    }

    // 边界与回退
    const maxLeft = containerRect.width - toolbarW - pad
    if (left > maxLeft) left = Math.max(pad, maxLeft)
    if (left < pad) left = pad

    const maxTop = containerRect.height - toolbarH - pad
    if (!isForward && top < pad) {
      top =
        (caretRect ? caretRect.bottom : fallback.bottom) -
        containerRect.top +
        gap
    }
    if (isForward && top > maxTop) {
      top =
        (caretRect ? caretRect.top : fallback.top) -
        containerRect.top -
        toolbarH -
        gap
    }
    if (top < pad) top = pad
    if (top > maxTop) top = maxTop

    setPosition({ left, top })
    setVisible(true)
  }

  useEffect(() => {
    if (!editor) return
    const onMouseDown = () => setVisible(false)
    const onMouseUp = () => {
      setTimeout(() => {
        updatePositionFromSelection()
      }, 50)
    }
    const onScrollOrResize = () => {
      if (visible) updatePositionFromSelection()
    }

    const dom = editor.view.dom as HTMLElement
    dom.addEventListener('mousedown', onMouseDown)
    dom.addEventListener('mouseup', onMouseUp)
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      dom.removeEventListener('mousedown', onMouseDown)
      dom.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [editor, updatePositionFromSelection, visible])
  return position
}
