import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // 可以换主题

interface RenderHighLightCodeProps {
  language: string; // 'javascript', 'typescript', 'python', 'bash', etc.
  content: string;
}

export const RenderHighLightCode: React.FC<RenderHighLightCodeProps> = ({ language, content }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [language, content]);

  return (
    <pre>
      <code ref={codeRef} className={language} style={{
        userSelect: 'none',
      }}>
        {content}
      </code>
    </pre>
  );
};
