import { useEffect } from "react";

export const useTheme = (theme:string) => {
  // 当主题变化时更新编辑器样式
  useEffect(() => {
    const editorElement = document.querySelector('.tiptap-editor');
    if (editorElement) {
      // 移除所有主题类
      editorElement.classList.remove('theme-light', 'theme-dark');
      // 添加当前主题类
      editorElement.classList.add(`theme-${theme}`);
    }
  }, [theme]);
}