import { EditorConfig } from '../type';
import Core from '@/component/core';

declare const VERSION: string;

/**
 * DEditor
 *
 * DEditor 主类
 *
 * @version 0.1.0
 *
 * @license MIT
 * @author zhaojj11
 */
export default class Uditor {
  public isReady: Promise<void>;

  public static get version(): string {
    return VERSION;
  }

  constructor(configuration?: EditorConfig) {
    const editor = new Core(configuration);
    this.isReady = editor.isReady.then(() => {
      console.log('hello');
    });
  }
}
