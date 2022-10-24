import { App } from '../app';

export type ExecFn = (app?: App) => void | Promise<void>;

export enum ExecPluginRuntime {
  beforeApply,
  afterApply,
}

export interface ExecPluginOptions {
  run: ExecPluginRuntime;
}
