import { Editor, Extension } from '@tiptap/core'
import { suggestionConfig } from './config/slash'
import Suggestion,{ type SuggestionOptions } from '@tiptap/suggestion';

export interface SlashCommandOptions {
  suggestion?: SuggestionOptions
}

export const slashCommandExtention = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',
  addOptions() {
    return {
      suggestion: {
        ...suggestionConfig
      } as any,
    }
  },
  addProseMirrorPlugins() {
    const suggestionConfig = {
      ...this.options.suggestion,
      editor: this.editor,
    };
    return [
      Suggestion(suggestionConfig as Parameters<typeof Suggestion>[0]),
    ];
  },
})