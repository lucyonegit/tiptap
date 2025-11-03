import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

export const CustomCodeBlock = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      // language: {
      //   default: 'html',
      //   parseHTML: element => element.getAttribute('data-language'),
      //   renderHTML: attributes => {
      //     if (!attributes.language) {
      //       return {};
      //     }
      //     return {
      //       'data-language': attributes.language,
      //     };
      //   },
      // },
    };
  },
  addNodeView() {
    return (props) => {
      console.log('node', this,props)
      const dom = document.createElement('pre');
      const contentDOM = document.createElement('code');
      contentDOM.className = 'editor-code-hlj-hahha';
      dom.appendChild(contentDOM);
      return {
        dom,
        contentDOM,
      }
    }
  },
});