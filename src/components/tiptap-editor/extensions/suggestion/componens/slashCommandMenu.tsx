import type { Editor } from "@tiptap/core";
import { Dropdown, Menu, type MenuProps } from "antd";
import { useEffect, useRef, useState } from "react";

import { commands } from "../config/command";

export const SlashCommandMenu: React.FC<{
  editor: Editor | null;
  range: { from: number; to: number };
  isVisible: boolean;
  onClose: () => void;
}> = ({ editor, range, isVisible, onClose }) => {
  const [open, setOpen] = useState(isVisible);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(isVisible);
  }, [isVisible]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const command = commands[parseInt(key)];
    if (editor && command) {
      editor
        .chain()
        .focus()
        .deleteRange({ from: range.from, to: range.to })
        .run();
      command.command(editor);
    }
    setOpen(false);
    onClose();
  };

  // 构建菜单项
  const menuItems = commands.map((cmd, index) => ({
    key: String(index),
    label: (
      <div style={{ padding: '4px 0' }}>
        <div style={{ fontWeight: 500 }}>{cmd.title}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>{cmd.description}</div>
      </div>
    ),
  }));

  if (!editor) return null;

  return (
    <div ref={triggerRef} contentEditable={false} style={{ position: 'absolute', top: 0, left: 0 }}>
      <Dropdown
        open={open}
        onOpenChange={(visible) => {
          if (!visible) {
            setOpen(false);
            onClose();
          }
        }}
        dropdownRender={() => (
          <Menu
            onClick={handleMenuClick}
            items={menuItems}
            style={{ width: 240 }}
          />
        )}
        trigger={['click']}
        placement="bottomLeft"
        getPopupContainer={() => document.body}
      >
        <div style={{height:28}} />
      </Dropdown>
    </div>
  );
};