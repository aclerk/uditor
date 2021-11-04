import renderer from '@/editor/renderer';
import core from '@/editor/core';
import html from '@/editor/html';
import { Block } from '@/editor/Block';
import { BlockType } from '@/type/block-type';
import parser from '@/editor/parser';

class Callback {
  /** 按键枚举 */
  static key = {
    TAB: 9,
    ENTER: 13,
    BACKSPACE: 8,
    DELETE: 46,
    DOWN: 40,
    SPACE: 32,
    ESC: 27,
    CTRL: 17,
    META: 91,
    SHIFT: 16,
    ALT: 18
  };
  public globalKeydownCallback(event: any) {
    switch (event.keyCode) {
      case Callback.key.ENTER:
        Callback.enterKeyPressed(event);
        break; // Enter
    }
  }

  private static enterKeyPressed(event: any) {
    const block = new Block();
    block.type = BlockType.Paragraph;
    block.show = '';
    block.content = '';
    core.blockData.push(block);
    const newNode = renderer.createBlock('div', block, core.blockData.length);
    core.insertAfter(event.target.parentNode.parentNode, newNode);

    html.focusNode(newNode);
    event.preventDefault();
  }

  public wrapperClicked(event: any) {
    console.log(event);
    const node = html.getNodeFocused();
    if (!node) {
      return;
    }
    const redactor = node.parentNode?.parentNode?.parentNode;
    const block = node.parentNode?.parentNode as HTMLElement;
    const children = redactor?.children;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        child.classList.remove('daily_editor_block_active');
      }
    }
    block?.classList.add('daily_editor_block_active');
  }

  public input(event: Event) {
    if (event) {
      let range: Range | undefined;
      const selection = getSelection();
      if (event.type === 'compositionend') {
        range = selection?.getRangeAt(0);
      } else if (event.type === 'input') {
        range = selection?.getRangeAt(0);
      }
      if (range) {
        const text = range.startContainer as Text;
        const currentNode = event.target as HTMLElement;
        const blockNode = currentNode.parentElement?.parentElement;
        const order = parseInt(currentNode.dataset.order || '0') - 1;
        const block = core.blockData[order];

        if (blockNode != null) {
          const rangeStartOffset = range.startOffset;
          if ((blockNode.children[0].children[0] as HTMLElement).children.length === 0) {
            block.content = text.data;
          } else {
            block.content = (blockNode.children[0].children[0] as HTMLElement).innerText;
          }
          parser.parseBlock(blockNode, block);

          range.setStart(text, rangeStartOffset);
          if (
            (blockNode.children[0].children[0] as HTMLElement).children.length === 0 &&
            block.type !== BlockType.Paragraph
          ) {
            currentNode.innerHTML = '';
            const span = document.createElement('span');
            span.innerHTML = block.prefix;
            span.classList.add('daily_editor_marking');
            const textNode = document.createTextNode(block.show);
            // 由于block中内容被修改所有需要重新设置start
            range.setStart(textNode, rangeStartOffset - block.prefix.length);
            currentNode.appendChild(span);
            currentNode.appendChild(textNode);
          }
          range.collapse(true);
          // // 清除选定对象的所有光标对象
          selection?.removeAllRanges();
          // // 插入新的光标对象
          selection?.addRange(range);
          event.preventDefault();
        }
      }
    }
  }
}

const callback = new Callback();
export default callback;
