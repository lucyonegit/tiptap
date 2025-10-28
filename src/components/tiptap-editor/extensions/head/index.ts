import { Heading } from '@tiptap/extension-heading';
import { ReactNodeViewRenderer } from '@tiptap/react';
import {HeadRender} from './render/head';

const Customheading = Heading.extend({
  addNodeView() {
    return ReactNodeViewRenderer(HeadRender);
  },
});

export default Customheading;