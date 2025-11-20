import type { Editor } from "@tiptap/core";

// 命令项定义
export type CommandItem = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  command: (editor: Editor) => void;
};

export const commands: CommandItem[] = [
  {
    title: 'Heading 1',
    description: 'Big section heading',
    command: (editor) => editor.chain().focus().setHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    command: (editor) => editor.chain().focus().setHeading({ level: 2 }).run(),
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list',
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: 'Code Block',
    description: 'Capture a code snippet',
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: 'Blockquote',
    description: 'Insert a quote',
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: 'Horizontal Rule',
    description: 'Insert a divider',
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
];
