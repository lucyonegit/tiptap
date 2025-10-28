import { Link } from '@tiptap/extension-link';
import { mergeAttributes, ReactMarkViewRenderer } from '@tiptap/react';
import CustomLinkView from './render/CustomLinkView';


const escapeTitle = (title: string) =>
  // 简单转义双引号和换行，按需增强
  title.replace(/"/g, '\\"').replace(/\n/g, ' ')

const CustomLink = Link.extend({
  addAttributes() {
    return {
      // @ts-ignore
      ...this.parent?.(),
      title: {
        default: null,
        parseHTML: element => element.getAttribute('title'),
        renderHTML: attributes => {
          if (!attributes.title) {
            return {};
          }
          return {
            title: attributes.title,
          };
        }
      }
    }
  },
  renderMarkdown(node, helpers) {
    const { href, title } = node.attrs as any;
    // 渲染子节点内容（链接文本）
    const content = helpers.renderChildren(node);
    
    // 返回 markdown 格式
    if (title) {
      const escapedTitle = title.replace(/"/g, '\\"');
      return `[${content}](${href} "${escapedTitle}")`;
    }
    
    return `[${content}](${href})`;
  },
  parseHTML() {
    return [
      {
        tag: 'a[href]',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['a', mergeAttributes({ class: 'editor-link' }, HTMLAttributes), 0];
  },
  addMarkView() {
    return ReactMarkViewRenderer(CustomLinkView);
  },
});

export default CustomLink;