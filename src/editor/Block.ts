import { BlockType } from '@/type/block-type';

export class Block {
  type: BlockType = BlockType.Paragraph;
  prefix = '';
  content = '';
  show = '';
}
