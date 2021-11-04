/**
 * 文本解析器
 */
import { Block } from '@/editor/Block';
import { BlockType } from '@/type/block-type';

class Parser {
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
}

const parser = new Parser();

export default parser;
