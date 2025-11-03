
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { TextSelection } from '@tiptap/pm/state';

export const TableSelectionExtension = Extension.create({
  name: 'tableSelection',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('tableSelection'),
        
        props: {
          handleDOMEvents: {
            mouseup: (view, event) => {
              // 获取当前选区
              const { state } = view;
              const { selection } = state;
              
              // 如果没有选中内容，直接返回
              if (selection.empty) {
                return false;
              }

              // 获取鼠标位置对应的 ProseMirror 位置
              const pos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY
              });

              if (!pos) {
                return false;
              }

              // 查找鼠标位置是否在表格节点内
              const $pos = state.doc.resolve(pos.pos);
              let tableNode = null;
              let tablePos = null;

              // 向上遍历查找表格节点
              for (let d = $pos.depth; d > 0; d--) {
                const node = $pos.node(d);
                if (node.type.name === 'table') {
                  tableNode = node;
                  tablePos = $pos.before(d);
                  break;
                }
              }

              // 如果鼠标不在表格上，直接返回
              if (!tableNode || tablePos === null) {
                return false;
              }

              // 计算表格的结束位置
              const tableEndPos = tablePos + tableNode.nodeSize;

              // 获取原始选区的范围
              const { from, to } = selection;

              // 计算新的选区范围：包含原始选区和整个表格
              const newFrom = Math.min(from, tablePos);
              const newTo = Math.max(to, tableEndPos);

              // 创建新的文本选区
              const tr = state.tr.setSelection(
                TextSelection.create(state.doc, newFrom, newTo)
              );

              // 应用新选区
              view.dispatch(tr);

              return true;
            }
          }
        }
      })
    ];
  }
});