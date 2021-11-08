import { EditorConfig } from './config';

export { EditorConfig } from './config';

declare class DEditor {
  public static VERSION: string;
  constructor(configuration?: EditorConfig | string);
}

export as namespace DEditor;
export default DEditor;
