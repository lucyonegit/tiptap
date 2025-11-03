import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import { AIModal } from './components/dragModal/func'
import { Dropdown, type MenuProps, Tooltip } from 'antd'
import { usePostion } from './hooks/usePosition'

import  FactCheck  from './assets/fact-check.svg'
import Rewrite from './assets/rewrite.svg'
import Blod from './assets/blod.svg'
import Underline from './assets/underline.svg'
import Italic  from './assets/italic.svg'
import DropdownIcon from './assets/dropdown.svg'
import { useEditor } from '../../contexts/EditorContext'


export const MarkdownToolPlugin: React.FC = () => {
  const { editor } = useEditor()
  const [visible, setVisible] = useState(false)
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  // const [modalOpen, setModalOpen] = useState<boolean>(false)
  const position = usePostion(setVisible, toolbarRef, visible)
  const [selectedKey, setSelectedKey] = useState<'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'doc' | 'ol' | 'ul'>('doc')

  

  const isActive = (name: string, options?: any) =>
    editor ? editor.isActive(name as any, options) : false



  // 计算ai改写弹层位置
  const computedModalPostion = () => {
    const editorEle = document.querySelector('.tiptap-editor');
    if (!editorEle) return
    const EDITOR_WIDTH = editorEle.getBoundingClientRect().width
    const MODAL_WIDTH = EDITOR_WIDTH || 745
    const MODAL_MAX_HEIGHT = 366
    const PAD = 20
    const toolbar = document.querySelector('.selection-toolbar') as HTMLElement
    if (toolbar) {
      const { top, left, width, height } = toolbar.getBoundingClientRect()
      let newLeft = left
      let newTop = top
      if (left + MODAL_WIDTH > window.innerWidth) {
        // 如果距离超出右边
        newLeft = window.innerWidth - MODAL_WIDTH - PAD
      }
      if (top + MODAL_MAX_HEIGHT > window.innerHeight) {
        newTop = window.innerHeight - MODAL_MAX_HEIGHT - PAD
      }
      return { top: newTop, left: newLeft }
    }
    return { top: '50%', left: '50%', transform: 'translate(-50%, 0)' }
  }

  // 获取选中区的markdown
  const getSelectionMd = (): string => {
    if(!editor) return ''
    const { state } = editor
    const { from, to } = state.selection
    const slice = state.doc.slice(from, to)

    const md = editor.schema.nodes.doc.create(null, slice.content)
    
    const slicemd = editor.markdown?.serialize(md.toJSON())
    console.log('md', slicemd)
    return slicemd || ''
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'H1',
      label: <div className='w-[204px]'>H1</div>,
    },
    {
      key: 'H2',
      label: <div className='w-[204px]'>H2</div>,
    },
    {
      key: 'H3',
      label: <div className='w-[204px]'>H3</div>,
    },
    {
      key: 'H4',
      label: <div className='w-[204px]'>H4</div>,
    },
    {
      key: 'H5',
      label: <div className='w-[204px]'>H5</div>,
    },
    {
      key: 'H6',
      label: <div className='w-[204px]'>H6</div>,
    },
    {
      key: 'doc',
      label: <div className='w-[204px]'>正文</div>,
    },
    {
      key: 'ol',
      label: <div className='w-[204px]'>有序列表</div>,
    },
    {
      key: 'ul',
      label: <div className='w-[204px]'>无序列表</div>,
    },
  ]

  const activeMap = {
      H1: {
        isActive: isActive('heading', { level: 1 }),
        label: 'H1',
        key: 'H1'
      },
      H2: {
        isActive: isActive('heading', { level: 2 }),
        label: 'H2',
        key: 'H2'
      },
      H3: {
        isActive: isActive('heading', { level: 3 }),
        label: 'H3',
        key: 'H3'
      },
      H4: {
        isActive: isActive('heading', { level: 4 }),
        label: 'H4',
        key: 'H4'
      },
      
      H5: {
        isActive: isActive('heading', { level: 5 }),
        label: 'H5',
        key: 'H5'
      },
      H6: {
        isActive: isActive('heading', { level: 6 }),
        label: 'H6',
        key: 'H6'
      },
      doc: {
        isActive: isActive('paragraph'),
        label: '正文',
        key: 'doc'
      },
    ol: {
      isActive: isActive('orderedList'),
      label:  '有序列表',
      key: 'ol'
    },
    ul: {
      isActive: isActive('bulletList'),
      label: '无序列表',
      key: 'ul'
    },
  }

  const defaultSelectedItem = Object.values(activeMap).filter(i => i.isActive)[0];

  useEffect(() => {
    if(!defaultSelectedItem) return
    setSelectedKey(defaultSelectedItem.key as any)
  },[defaultSelectedItem?.key])

  if (!editor || !visible) return null

  console.log('defaultSelectedItem:', defaultSelectedItem)

  const actions = [
    {
      key: 'ai',
      label: 'AI改写',
      icon: Rewrite,
      run: () => {
        editor.chain().focus().blur()
        const position = computedModalPostion()
        const selectionText = editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          ' ',
        )
        const md = getSelectionMd()
        AIModal.show({
          initialPosition: position,
          renderContent: (dragEvent, setCanCloseOutclick, close) => (
            <div onClick={()=>{
              //  const html = parseMarkdown(disableSetextHeading(''))
              //   const event = new ClipboardEvent('paste', {
              //     clipboardData: new DataTransfer(),
              //     bubbles: true,
              //     cancelable: true,
              //   })
              //   event.clipboardData?.setData('text/html', html)
              //   editor.view.dom.dispatchEvent(event)
              //   close()
            }}>click</div>
          ),
        })
      },
    },
    {
      key: 'tools',
      label: '',
      icon: (
        <Dropdown
          menu={{
            items: menuItems,
            selectable: true,
            multiple: false,
            defaultSelectedKeys: [defaultSelectedItem?.key],
            selectedKeys: [selectedKey],
            onClick: ({key}) => {
              setSelectedKey(key as any);
              if (key === 'H1' || key === 'H2' || key === 'H3' || key === 'H4' || key === 'H5' || key === 'H6') {
                const level = Number(key.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6
                editor.chain().focus().setHeading({ level }).run();
                return;
              }
              if(key === 'doc') {
                editor.chain().focus().setParagraph().run();
                return;
              }
              if(key === 'ol') {
                editor.chain().focus().toggleOrderedList().run();
                return;
              }
              if(key === 'ul') {
                editor.chain().focus().toggleBulletList().run();
                return;
              }
            }
          }}
          placement='bottomLeft'
          overlayClassName='pt-[5px]'
          trigger={['click']}
        >
          <span className='flex items-center justify-between gap-[4px] px-[8px]'>
            <span>{activeMap[selectedKey as keyof typeof activeMap]?.label}</span>
            <img src={DropdownIcon} alt="" />
          </span>
        </Dropdown>
      ),
    },
    {
      key: 'bold',
      label: '',
      icon: Blod,
      tooltip: '文字加粗',
      run: () => editor!.chain().focus().toggleBold().run(),
    },
    {
      key: 'italic',
      label: '',
      icon: Italic,
      tooltip: '文字斜体',
      run: () => editor!.chain().focus().toggleItalic().run(),
    },
    {
      key: 'underline',
      label: '',
      icon: Underline,
      tooltip: '文字下划线',
      run: () => editor!.chain().focus().toggleUnderline().run(),
    },
    {
      key: 'split-line',
      label: '|',
      icon: <></>,
      run: () => {},
    },
    {
      key: 'fact-check',
      label: '事实核查',
      icon: FactCheck,
      run: () => {
        const selectedText = editor!.state.doc.textBetween(
          editor!.state.selection.from,
          editor!.state.selection.to,
          ' ',
        )
        console.log('selectedText:', selectedText)
      },
    },
  ]

  
  
  return (
    <div
      ref={toolbarRef}
      className='selection-toolbar'
      style={{
        height: '36px',
        padding: '4px 8px',
        left: position.left,
        borderRadius: 100,
        top: position.top,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(40px)',
        border: '0.5px solid rgba(225, 225, 229, 0.8)',
        boxShadow: '0px 3px 20px 0px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '2px',
        whiteSpace: 'nowrap',
      }}
    >
      {actions.map(a => {
        if (a.key === 'split-line') {
          return (
            <div key={a.key} className='w-[1px] h-[50%] bg-[#E6E8EB]'></div>
          )
        }
        return (
          <Tooltip key={a.key} title={a.tooltip} placement='bottom'>
            <div
              className={`min-w-[28px] min-h-[28px] flex flex-row items-center justify-center hover:bg-[#E6E8EB] cursor-pointer  transition-all rounded-[28px] ${isActive(a.key) ? 'bg-[#E6E8EB]' : ''} ${a.label ? 'px-[8px]' : ''}`}
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                a.run && a.run()
                if(a.key === 'ai' || a.key === 'fact-check') {
                  setVisible(false)
                }
                if (a.run!) {
                  // setVisible(false)
                } else {
                  editor.chain().blur()
                }
              }}
            >
              <div className='flex items-center gap-[2px]'>
                {a.icon && typeof a.icon === 'string' ? <img src={a.icon as string} alt="" /> : a.icon}
                <div>{a.label}</div>
              </div>
            </div>
          </Tooltip>
        )
      })}
    </div>
  )
}
