import { EditorModules } from '@/types/editor-modules';

export type ModuleNodes = Record<string, unknown>;

export default class Module<T extends ModuleNodes = Record<string, unknown>> {
  public nodes: T = {} as any;

  protected Editor: EditorModules;
}
