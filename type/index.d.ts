import { EditorConfig } from './config';

export { EditorConfig } from './config';

declare class Uditor {
  public static VERSION: string;
  constructor(configuration?: EditorConfig | string);
}

export as namespace Uditor;
export default Uditor;
