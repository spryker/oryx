import {
  App,
  AppPlugin,
  AppPluginAfterApply,
  AppPluginBeforeApply,
} from '../app';
import { ExecFn, ExecPluginOptions, ExecPluginRuntime } from './exec.model';

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
    if (this.runtime === ExecPluginRuntime.beforeApply)
      return this.fn(this.app);
  }

  apply(app: App): void | Promise<void> {
    this.app = app;

    if (this.runtime === undefined) return this.fn(this.app);
  }

  afterApply(): void | Promise<void> {
    if (this.runtime === ExecPluginRuntime.afterApply) return this.fn(this.app);
  }
}
