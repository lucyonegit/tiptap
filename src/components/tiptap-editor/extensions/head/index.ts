import { Heading } from '@tiptap/extension-heading';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Plugin } from '@tiptap/pm/state';
import {HeadRender} from './render/head';

const Customheading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      collapsed: {
        default: false,
        parseHTML: el => el.getAttribute('data-collapsed') === 'true',
        renderHTML: attrs => {
          if (attrs.collapsed) return { 'data-collapsed': 'true' };
          return {};
        },
      },
    };
  },
  addCommands() {
    return {
      toggleFold:
        () => ({ state, dispatch }) => {
          const { tr, doc, selection } = state;
          const $from = selection.$from;
          let depth = $from.depth;
          let targetDepth: number | null = null;
          while (depth >= 0) {
            if ($from.node(depth).type.name === this.name) {
              targetDepth = depth;
              break;
            }
            depth--;
          }
          if (targetDepth == null) return false;
          const pos = $from.before(targetDepth);
          const node = doc.nodeAt(pos);
          if (!node) return false;
          const collapsed = !node.attrs.collapsed;
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, collapsed });
          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: state => {
            const { doc } = state;
            const decorations: Decoration[] = [];
            doc.descendants((node, pos) => {
              if (node.type.name !== this.name) return;
              if (!node.attrs.collapsed) return;
              const level = node.attrs.level;
              const start = pos + node.nodeSize;
              let end = doc.content.size;
              let found = false;
              doc.descendants((n2, pos2) => {
                if (pos2 <= pos) return;
                if (found) return;
                if (n2.type.name === this.name && n2.attrs.level <= level) {
                  end = pos2;
                  found = true;
                }
              });
              doc.nodesBetween(start, end, (n, p) => {
                decorations.push(Decoration.node(p, p + n.nodeSize, { style: 'display: none;' }));
              });
            });
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(HeadRender);
  },
});

export default Customheading;