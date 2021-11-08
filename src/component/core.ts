import { EditorConfig } from '../../type';
import Block from '@/component/block/block';
import { BlockType } from '@/component/block/block-type';

export default class Core {
  nodes: {
    textarea: HTMLElement | null;
    wrapper: HTMLElement | null;
    redactor: HTMLElement | null;
  } = {
    textarea: null,
    wrapper: null,
    redactor: null
  };
  public blockData: Array<Block> = new Array<Block>();
  public config: EditorConfig;
  public isReady: Promise<void>;
  constructor(config?: EditorConfig) {
    let onReady, onFail;
    this.isReady = new Promise((resolve, reject) => {
      onReady = resolve;
      onFail = reject;
    });
    Promise.resolve()
      .then(async () => {
        const textarea = document.getElementById(config.holderId);
        this.nodes.textarea = textarea;
        // todo 启动
        setTimeout(async () => {
          this.make();
          this.bindEvents();
          onReady();
        }, 500);
      })
      .catch((error) => {
        onFail(error);
      });
  }

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
      case Core.key.ENTER:
        this.enterKeyPressed(event);
        break; // Enter
    }
  }

  public enterKeyPressed(event: any) {
    const block = new Block();
    block.type = BlockType.Paragraph;
    block.show = '';
    block.content = '';
    this.blockData.push(block);
    const newNode = this.createBlock('div', block, this.blockData.length);
    this.insertAfter(event.target.parentNode.parentNode, newNode);

    this.focusNode(newNode);
    event.preventDefault();
  }

  public insertAfter(target: HTMLElement, element: HTMLElement) {
    target.parentNode?.insertBefore(element, target.nextSibling);
  }

  public wrapperClicked(event: any) {
    console.log(event);
    const node = this.getNodeFocused();
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
        const block = this.blockData[order];

        if (blockNode != null) {
          const rangeStartOffset = range.startOffset;
          if ((blockNode.children[0].children[0] as HTMLElement).children.length === 0) {
            block.content = text.data;
          } else {
            block.content = (blockNode.children[0].children[0] as HTMLElement).innerText;
          }
          this.parseBlock(blockNode, block);

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

  public focusNode(node: HTMLElement): void {
    node.focus();
    const redactor = node.parentNode;
    const block = node as HTMLElement;
    const children = redactor?.children;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        child.classList.remove('daily_editor_block_active');
      }
    }
    block?.classList.add('daily_editor_block_active');
    if (node.children != null && node.children.length > 0) {
      const son = node.children.item(0);
      if (son != null && son.children != null && son.children.length != null) {
        const grandson = son.children.item(0);
        if (grandson != null) {
          (grandson as HTMLElement).focus();
          if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
            const range = document.createRange();

            range.selectNodeContents(grandson);
            range.collapse(false);

            const sel = window.getSelection();
            if (sel !== null) {
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }
        }
      }
    }
  }

  public getNodeFocused() {
    const selection = window.getSelection();

    if (selection != null && selection.anchorNode != null) {
      const node = selection.anchorNode as HTMLElement;
      return node.tagName ? node : selection.focusNode?.parentElement;
    } else {
      return null;
    }
  }

  public parseBlock(blockNode: HTMLElement, block: Block) {
    block.show = block.content;
    // 渲染
    const content = block.content;
    if (content) {
      if (content.length == 0) {
        block.prefix = '';
        block.type = BlockType.Paragraph;
        block.show = '';
        block.content = '';
      } else if (content.startsWith('# ')) {
        block.type = BlockType.H1;
        block.prefix = '# ';
        block.show = content.substring(2);
      } else if (content.startsWith('## ')) {
        block.type = BlockType.H2;
        block.prefix = '## ';
        block.show = content.substring(3);
      } else if (content.startsWith('### ')) {
        block.type = BlockType.H3;
        block.prefix = '### ';
        block.show = content.substring(4);
      } else if (content.startsWith('#### ')) {
        block.type = BlockType.H4;
        block.prefix = '#### ';
        block.show = content.substring(5);
      } else if (content.startsWith('##### ')) {
        block.type = BlockType.H5;
        block.prefix = '##### ';
        block.show = content.substring(6);
      } else if (content.startsWith('###### ')) {
        block.type = BlockType.H6;
        block.prefix = '###### ';
        block.show = content.substring(6);
      } else {
        block.prefix = '';
        block.type = BlockType.Paragraph;
        block.show = content;
      }
    } else {
      block.prefix = '';
      block.type = BlockType.Paragraph;
      block.show = '';
      block.content = '';
    }
    (blockNode.firstElementChild as HTMLElement).className = 'daily_editor_block_content';
    (blockNode.firstElementChild as HTMLElement).classList.add(block.type);
    (blockNode.firstElementChild as HTMLElement).dataset.type = block.type;
  }

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

  public composingLock = false;

  /**
   * 主入口
   */
  public make() {
    /** 创建包装器 */
    const wrapper = this.createWrapper();
    if (this.nodes.textarea == null) {
      return;
    }

    this.insertAfter(this.nodes.textarea, wrapper);

    const redactor = this.createRedactor();

    wrapper.appendChild(redactor);

    const b = new Block();
    b.type = BlockType.Paragraph;
    b.content = '';
    b.show = '';
    this.blockData.push(b);
    const block = this.createBlock('div', b);
    this.parseBlock(block, b);
    redactor.appendChild(block);
    this.focusNode(block);

    this.nodes.wrapper = wrapper;
    this.nodes.redactor = redactor;
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
    if (this.nodes.wrapper == null) {
      throw Error('构建失败');
    }

    // 中文处理
    this.nodes.wrapper.addEventListener(
      'compositionstart',
      (event) => {
        console.log(event);
        this.composingLock = true;
      },
      false
    );
    this.nodes.wrapper.addEventListener(
      'compositionend',
      (event) => {
        this.input(event);
        this.composingLock = false;
      },
      false
    );

    // 处理普通输入
    this.nodes.wrapper.addEventListener(
      'input',
      (event) => {
        if (this.composingLock) {
          return;
        }
        this.input(event);
      },
      false
    );

    this.nodes.wrapper.addEventListener(
      'keydown',
      (event) => {
        this.globalKeydownCallback(event);
      },
      false
    );

    this.nodes.wrapper.addEventListener(
      'click',
      (event) => {
        this.wrapperClicked(event);
      },
      false
    );
  }
}
