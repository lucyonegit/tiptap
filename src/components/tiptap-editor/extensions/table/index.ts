import { Table } from '@tiptap/extension-table';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TableView } from './render/TableView';

export const CustomTable = Table.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TableView);
  },
});

export default CustomTable;