import Module from '@/component/module';
import Block from '@/component/block/block';

export default class UI extends Module {
  static TAG_NAME = {
    DIV: 'DIV'
  };

  static ATTRIBUTION = {
    CONTENTEDITABLE: 'contenteditable'
  };

  static CLASS_NAME = {
    /**
     * @const {string} WRAPPER_CLASSNAME - wrapper name
     */
    WRAPPER_CLASSNAME: 'daily_editor_wrapper',
    /**
     * @const {string} REDACTOR_CLASSNAME - redactor blocks name
     */
    REDACTOR_CLASSNAME: 'daily_editor_redactor',

    /**
     * @const {String} BLOCK_CLASSNAME - block class name
     */
    BLOCK_CLASSNAME: 'daily_editor_block',

    /**
     * @const {String} BLOCK_ACTIVE_CLASSNAME - block active
     */
    BLOCK_ACTIVE_CLASSNAME: 'daily_editor_block_active',

    /**
     * @const {String} BLOCK_CONTENT_CLASSNAME - block content
     */
    BLOCK_CONTENT_CLASSNAME: 'daily_editor_block_content',

    /**
     * @const {String} BLOCK_CONTENT_DETAIL_CLASSNAME - block content detail
     */
    BLOCK_CONTENT_DETAIL_CLASSNAME: 'daily_editor_block_content_detail',

    /**
     * @const {String} MARKING_CLASSNAME - marking
     */
    MARKING_CLASSNAME: 'daily_editor_marking',

    H1: 'H1',
    H2: 'H2',
    H3: 'H3',
    H4: 'H4',
    H5: 'H5',
    H6: 'H6'
  };

  /**
   * 编辑器包装
   * 创建如下的编辑器包装区域,在此div中进行基本编辑器操作
   * <pre>
   * <div class="daily_editor_wrapper">
   * </div>
   * </pre>
   */
  public createWrapper(): HTMLElement {
    const wrapper = document.createElement(UI.TAG_NAME.DIV);

    wrapper.className += UI.CLASS_NAME.WRAPPER_CLASSNAME;

    return wrapper;
  }

  /**
   * div-content-editable 包装
   * <pre>
   * <div class="daily_editor_redactor">
   * </div>
   * </pre>
   */
  public createRedactor(): HTMLElement {
    const redactor = document.createElement(UI.TAG_NAME.DIV);

    redactor.classList.add(UI.CLASS_NAME.REDACTOR_CLASSNAME);

    return redactor;
  }

  /**
   * 创建块
   * @param tagName 标签名
   * @param block 内容
   * @param order 顺序
   */
  public createBlock(tagName: string, block: Block, order = 1) {
    const b = document.createElement(UI.TAG_NAME.DIV);
    b.classList.add(UI.CLASS_NAME.BLOCK_CLASSNAME);

    const blockContent = document.createElement(UI.TAG_NAME.DIV);
    blockContent.classList.add(UI.CLASS_NAME.BLOCK_CONTENT_CLASSNAME);
    blockContent.dataset.type = block.type;

    const node = document.createElement(tagName);
    node.setAttribute(UI.ATTRIBUTION.CONTENTEDITABLE, 'true');
    node.dataset.order = order.toString();
    node.classList.add(UI.CLASS_NAME.BLOCK_CONTENT_DETAIL_CLASSNAME);
    node.innerHTML = block.show || '';

    blockContent.appendChild(node);
    b.appendChild(blockContent);

    return b;
  }
}
