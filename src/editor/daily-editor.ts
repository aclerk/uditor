import core from '@/editor/core';
import ui from '@/editor/ui';

class DailyEditor {
  settings = {
    new_block_tool: ['text', 'heading', 'list-unordered'],
    block_tool: [{ type: 'heading', tools: ['h-1', 'h-2', 'h-3', 'h-4', 'h-5', 'h-6'] }],
    inline_tool: ['convert', 'bold', 'italic', 'underline', 'strikethrough'],
    textareaId: 'daily-editor'
  };
  nodes: {
    textarea: HTMLElement | null;
    wrapper: HTMLElement | null;
    redactor: HTMLElement | null;
  } = {
    textarea: null,
    wrapper: null,
    redactor: null
  };

  public start(userSettings: UserSettings): void {
    // 用户参数配置
    core
      .prepare(userSettings)
      // 配置成功则可以进行渲染
      .then(() => ui.make())
      // 绑定事件
      .then(() => ui.bindEvents())
      .catch((error) => {
        console.error(`Initialization failed with error: ${error}`);
      });
  }
}

const dailyEditor = new DailyEditor();

export default dailyEditor;
