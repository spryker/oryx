import { AppPluginAfterApply, AppPluginBeforeApply } from '@spryker-oryx/core';
import { App, AppPlugin } from '../app';

export type ExecFn = (app?: App) => void | Promise<void>;

export enum ExecPluginRuntime {
  beforeApply,
  afterApply,
}

export interface ExecPluginOptions {
  run: ExecPluginRuntime;
}

export const ExecPluginName = 'core$exec';

/**
 * Plugin for executing any custom function.
 */
export class ExecPlugin
  implements AppPlugin, AppPluginBeforeApply, AppPluginAfterApply
{
  protected readonly runtime? = this.options?.run;
  protected app?: App;

  constructor(
    protected readonly fn: ExecFn,
    protected readonly options?: ExecPluginOptions
  ) {}

  getName(): string {
    return ExecPluginName;
  }

  beforeApply(): void | Promise<void> {
    if (this.runtime === ExecPluginRuntime.beforeApply) {
      return this.fn(this.app);
    }
  }

  apply(app: App): void | Promise<void> {
    this.app = app;

    if (this.runtime === undefined) {
      return this.fn(this.app);
    }
  }

  afterApply(): void | Promise<void> {
    if (this.runtime === ExecPluginRuntime.afterApply) {
      return this.fn(this.app);
    }
  }

  destroy(): void {
    //
  }
}
