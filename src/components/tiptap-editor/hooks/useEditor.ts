import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import CustomLink from '../extensions/link';
import CustomTable from '../extensions/table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Markdown } from '@tiptap/markdown'
import { all, createLowlight } from 'lowlight'

import { CustomCodeBlock } from '../extensions/code/index';
import CustomImage from '../extensions/image';
import CustomHeading from '../extensions/head';

import { TableSelectionExtension } from '../extensions/expand-selection'
import {slashCommandExtention} from '../extensions/suggestion'

import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/tomorrow-night-bright.min.css'


import { useEffect, useRef } from 'react';

const lowlight = createLowlight(all)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

export const useEditorInit = (initialContent: string, placeholder: string, onUpdate?: (content: string) => void) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const changeCount = useRef(0)
  const handleChange = (md: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    if (changeCount.current === 1) {
      // 第一次初始化，不触发保存逻辑
      return
    }
    changeCount.current++
    // 2 秒内没有新的输入，就触发保存逻辑
    timerRef.current = setTimeout(() => {
      onUpdate && onUpdate(md)
    }, 1000)
  }

  // 初始化编辑器
  const editor = useEditor({
    extensions: [
      Markdown,
      slashCommandExtention,
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'editor-paragraph',
          },
        },
        heading: false,
        link: false,
        horizontalRule: {
          HTMLAttributes: {
            class: 'editor-hr',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'editor-quote',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'editor-textCode',
          },
        },
        codeBlock: false,
        bulletList: {
          HTMLAttributes: {
            class: 'editor-list-ul',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'editor-list-ol',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'editor-listItem',
          },
        },
        bold: {
          HTMLAttributes: {
            class: 'editor-textBold',
          },
        },
        italic: {
          HTMLAttributes: {
            class: 'editor-textItalic',
          },
        },
        strike: {
          HTMLAttributes: {
            class: 'editor-textStrikethrough',
          },
        },
        underline: {
          HTMLAttributes: {
            class: 'editor-textUnderline',
          },
        }
      }),
      Highlight,
      CustomLink.configure({
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      CustomImage.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      CustomTable.configure({
        resizable: true,
        allowTableNodeSelection: true,
        HTMLAttributes: {
          class: 'editor-table',
        }
      }),
      CustomHeading.configure({
        HTMLAttributes: {
          class: 'editor-heading',
        }
      }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList.configure({
        HTMLAttributes: {
          class: 'editor-taskList',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'editor-listItemUnchecked',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
      TextStyle,
      Color,
      TableSelectionExtension,
      // CodeBlockLowlight.configure({
      //   lowlight,
      // }),
      CustomCodeBlock.configure({
        lowlight
      }),
    ],
    content: '',
    contentType: 'markdown',
    onUpdate: ({ editor }) => {
      const md = editor.getMarkdown();
      handleChange(md);
    },
  });
  
  useEffect(() => {
    if (initialContent) {
      editor.commands.setContent(initialContent, {
        contentType: "markdown",
      });
      return;
    }
  }, [initialContent]);

  return editor;
}