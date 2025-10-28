import { Image } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import {ImageRender} from './render/image';

const CustomImage = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageRender);
  },
});

export default CustomImage;