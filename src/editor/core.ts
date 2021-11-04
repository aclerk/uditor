import dailyEditor from '@/editor/daily-editor';
import { Block } from '@/editor/Block';

class Core {
  public blockData: Array<Block> = new Array<Block>();
  public prepare(userSettings: UserSettings) {
    return new Promise<void>((resolve, reject) => {
      const textarea = document.getElementById(userSettings.textareaId || dailyEditor.settings.textareaId);
      if (typeof textarea == undefined || textarea == null) {
        reject(Error(`Textarea wasn't found by ID: # ${userSettings.textareaId}`));
      } else {
        dailyEditor.nodes.textarea = textarea;
        resolve();
      }
    });
  }

  /**
   * 将一个element插入到另一个后面
   * @param target
   * @param element
   */
  public insertAfter(target: HTMLElement, element: HTMLElement) {
    target.parentNode?.insertBefore(element, target.nextSibling);
  }
}

const core = new Core();

export default core;
