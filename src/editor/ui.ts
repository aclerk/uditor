import dailyEditor from '@/editor/daily-editor';
import renderer from '@/editor/renderer';
import core from '@/editor/core';
import callback from '@/editor/callback';
import html from '@/editor/html';
import { Block } from '@/editor/Block';
import parser from '@/editor/parser';
import { BlockType } from '@/type/block-type';

class UI {
  public composingLock = false;

  /**
   * 主入口
   */
  public make() {
    /** 创建包装器 */
    const wrapper = renderer.createWrapper();
    if (dailyEditor.nodes.textarea == null) {
      return;
    }

    core.insertAfter(dailyEditor.nodes.textarea, wrapper);

    const redactor = renderer.createRedactor();

    wrapper.appendChild(redactor);

    const b = new Block();
    b.type = BlockType.Paragraph;
    b.content = '';
    b.show = '';
    core.blockData.push(b);
    const block = renderer.createBlock('div', b);
    parser.parseBlock(block, b);
    redactor.appendChild(block);
    html.focusNode(block);

    dailyEditor.nodes.wrapper = wrapper;
    dailyEditor.nodes.redactor = redactor;
  }

  /**
   * 将字符渲染成html内容
   */
  public parseContent() {
    console.info('ui.parseContent fired');
  }

  /**
   * 监听事件
   */
  public bindEvents() {
    console.info('ui.bindEvents fired');
    if (dailyEditor.nodes.wrapper == null) {
      throw Error('构建失败');
    }

    // 中文处理
    dailyEditor.nodes.wrapper.addEventListener(
      'compositionstart',
      (event) => {
        console.log(event);
        this.composingLock = true;
      },
      false
    );
    dailyEditor.nodes.wrapper.addEventListener(
      'compositionend',
      (event) => {
        callback.input(event);
        this.composingLock = false;
      },
      false
    );

    // 处理普通输入
    dailyEditor.nodes.wrapper.addEventListener(
      'input',
      (event) => {
        if (this.composingLock) {
          return;
        }
        callback.input(event);
      },
      false
    );

    dailyEditor.nodes.wrapper.addEventListener(
      'keydown',
      (event) => {
        callback.globalKeydownCallback(event);
      },
      false
    );

    dailyEditor.nodes.wrapper.addEventListener(
      'click',
      (event) => {
        callback.wrapperClicked(event);
      },
      false
    );
  }
}

const ui = new UI();

export default ui;
