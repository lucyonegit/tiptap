import React, { useEffect, useRef } from 'react';
import { NodeViewContent } from '@tiptap/react';

import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // 可以换主题

interface RenderHighLightCodeProps {
  language: string; // 'javascript', 'typescript', 'python', 'bash', etc.
  content: string;
}

export const RenderHighLightCode: React.FC<RenderHighLightCodeProps> = ({ language, content }) => {
  debugger
  const contentRef = useRef<HTMLElement>(null);

  // useEffect(() => {
  //   if (codeRef.current) {
  //     hljs.highlightElement(codeRef.current);
  //   }
  // }, [language, content]);

  // 实时高亮（副作用）
  useEffect(() => {
    const code = document.querySelector('code[data-node-view-content]') as HTMLElement;
    if (code) {
      if (language) {
        hljs.highlightElement(code);
      }
    }
  }, [content, language]);

  return (
    <pre>
      
      <NodeViewContent
        /* @ts-ignore */
        as={'code'}
        ref={contentRef as any}
      />
    </pre>
  );
};
