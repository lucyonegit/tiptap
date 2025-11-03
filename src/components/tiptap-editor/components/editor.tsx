import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { EditorContent, EditorContext, } from "@tiptap/react";
import { useEditorInit } from "../hooks/useEditor";
import { useTheme } from "../hooks/useTheme";
import { EditorProvider } from "../contexts/EditorContext";


import "../theme/default.css";
import "../theme/dark.css";

interface TiptapEditorProps {
  initialContent?: string;
  theme?: "default" | "dark";
  placeholder?: string;
  children?: React.ReactNode;
  editable?: boolean;
  onChange?: (content: string) => void;
}

export interface TiptapEditorRef {
  setContent: (content: string) => void;
}

export const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  (
    {
      initialContent = "",
      theme = "light",
      placeholder = "开始编辑...",
      children,
      editable = false,
      onChange,
    },
    ref
  ) => {
    const editor = useEditorInit(initialContent, placeholder, onChange);
    useTheme(theme);
    useEffect(() => {
      if (editor) {
        editor.setEditable(editable);
      }
    }, [editable]);
    useImperativeHandle(ref, () => ({
      setContent(content: string) {
        editor.commands.setContent(content, {
          contentType: "markdown",
        });
      },
    }));
    return (
      <div style={{ position: "relative" }}>
        <div className={`tiptap-editor theme-${theme}`}>
          <EditorContext.Provider value={{ editor }}>
            <EditorProvider editor={editor}>
              <EditorContent editor={editor} />
              {children}
            </EditorProvider>
          </EditorContext.Provider>
        </div>
      </div>
    );
  }
);
