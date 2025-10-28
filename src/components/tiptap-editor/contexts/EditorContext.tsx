import React, { createContext, useContext } from 'react';
import { Editor } from '@tiptap/react';

interface EditorContextType {
  editor: Editor | null;
}

const EditorContext = createContext<EditorContextType>({ editor: null });

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  editor: Editor | null;
  children: React.ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ editor, children }) => {
  return (
    <EditorContext.Provider value={{ editor }}>
      {children}
    </EditorContext.Provider>
  );
};