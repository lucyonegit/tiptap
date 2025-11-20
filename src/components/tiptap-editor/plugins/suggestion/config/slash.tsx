import type { Editor } from "@tiptap/core";
import { SlashCommandMenu } from "../componens/slashCommandMenu";
import Suggestion from '@tiptap/suggestion';
import { createRoot } from 'react-dom/client'
// Suggestion 配置
export const suggestionConfig = Suggestion({
  char: '/',
  allowSpaces: false,
  startOfLine: true, // 只在行首触发
  render: () => {
    const triggerDiv = document.createElement('div');
    document.body.appendChild(triggerDiv);

    let component: React.ReactElement | null = null;
    let popup: { update: (props: any) => void; destroy: () => void } | null = null;

    return {
      onStart: (props: any) => {
        const { editor } = props
        if (!editor) return;

        component = <SlashCommandMenu
          editor={editor}
          range={props.range}
          isVisible={true}
          onClose={() => {
            if (popup) popup.destroy();
          }}
        />;

        const root = createRoot(triggerDiv)
        root.render(component);

        // 定位：使用 Tiptap 提供的更新函数
        popup = {
          update: (props: any) => {
            const { clientRect } = props;
            if (clientRect) {
              triggerDiv.style.position = 'absolute';
              triggerDiv.style.left = `${clientRect.left}px`;
              triggerDiv.style.top = `${clientRect.top - 10}px`; // 稍微上移
              triggerDiv.style.zIndex = '1000';
            }
          },
          destroy: () => {
            root.unmount();
            triggerDiv.remove();
          },
        };

        if (props.clientRect) {
          popup.update(props);
        }
      },

      onUpdate: (props: any) => {
        popup?.update(props);
      },

      onKeyDown: (props: any) => {
        // 可选：处理键盘事件（如 ESC 关闭）
        if (props.event.key === 'Escape') {
          popup?.destroy();
          return true;
        }
        return false;
      },

      onExit: () => {
        popup?.destroy();
      },
    };
  },
} as any);