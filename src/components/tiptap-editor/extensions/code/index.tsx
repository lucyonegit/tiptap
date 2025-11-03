import { ReactNodeViewRenderer } from '@tiptap/react';
import {RenderCodeBlock} from './render';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

export const CustomCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(RenderCodeBlock);
  },
});
