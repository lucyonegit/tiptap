import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import {RenderCodeBlock} from './render';

export const CustomCodeBlock = Node.create({
  name: 'customCodeBlock',
  group: 'block',
  content: 'text*',
  addAttributes() {
    return {
      language: { default: null },
      content: { default: '' },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span.editor-code',
        getAttrs: dom => {
          return {
            language: dom.getAttribute('data-language'),
            content: dom.querySelector('code')?.innerText || '',
          }
        },
      },
    ];
  },
  renderMarkdown(node) {
    const { language, content } = node.attrs as any;
    const decodeContent = decodeURIComponent(content);
    if (language === 'mermaid') {
      return `\`\`\`${language}\n${decodeContent}\n\`\`\``;
    }
    return `\`\`\`${language}\n${decodeContent}\n\`\`\``;
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ class: 'editor-code' }, HTMLAttributes), 0];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(RenderCodeBlock);
  },
});
