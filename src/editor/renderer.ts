/**
 * 渲染器
 */
import { Block } from '@/editor/Block';

class Renderer {
  /**
   * 编辑器包装
   */
  public createWrapper(): HTMLElement {
    const wrapper = document.createElement('div');

    wrapper.className += 'daily_editor_wrapper';

    return wrapper;
  }

  /**
   * div-content-editable 包装
   */
  public createRedactor(): HTMLElement {
    const redactor = document.createElement('div');

    redactor.classList.add('daily_editor_redactor');

    return redactor;
  }

  /**
   * 没有图标 且 toggle 的 toolbar
   */
  public createToolbar(): HTMLElement {
    const bar = document.createElement('div');

    bar.classList.add('daily_editor_toolbar');
    bar.innerHTML = '<span class="toggler"><i class="daily-editor-icon daily-icon-plus"></i></span>';

    return bar;
  }

  /**
   * 创建工具栏按钮
   * @param type 按钮类型
   */
  public createToolbarButton(type: string): HTMLElement {
    const button = document.createElement('li');

    button.dataset.type = type;
    button.classList.add('daily-editor-toolbar-button');
    button.innerHTML = '<i class="daily-editor-icon daily-icon-' + type + '"></i>';

    return button;
  }

  /**
   * 创建块
   * @param tagName 标签名
   * @param block 内容
   * @param order 顺序
   */
  public createBlock(tagName: string, block: Block, order = 1) {
    const b = document.createElement('DIV');
    b.classList.add('daily_editor_block');

    const blockContent = document.createElement('DIV');
    blockContent.classList.add('daily_editor_block_content');
    blockContent.dataset.type = block.type;

    const node = document.createElement(tagName);
    node.setAttribute('contenteditable', 'true');
    node.dataset.order = order.toString();
    node.classList.add('daily_editor_block_content_detail');
    node.innerHTML = block.show || '';

    blockContent.appendChild(node);
    b.appendChild(blockContent);

    return b;
  }
}

const renderer = new Renderer();

export default renderer;
