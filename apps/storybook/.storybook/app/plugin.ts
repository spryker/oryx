import { App, AppPlugin, InjectionPlugin } from '@spryker-oryx/core';
import { addons } from '@storybook/addons';
import { SET_CURRENT_STORY } from '@storybook/core-events';
import { resource, theme } from './data';
import { SET_STORYBOOK_RESOURCE, SET_STORYBOOK_THEME } from './utils';
// @ts-ignore
import { initializeRTL } from 'storybook-addon-rtl';

export class StorybookPlugin implements AppPlugin {
  protected app?: App;

  getName(): string {
    return 'orchestrator$storybook';
  }

  async apply(app: App): Promise<void> {
    this.app = app;

    initializeRTL();
    addons.getChannel().emit(SET_STORYBOOK_THEME, theme);
    addons.getChannel().emit(SET_STORYBOOK_RESOURCE, resource);
    addons.getChannel().on(SET_CURRENT_STORY, this.reloadInjector);
  }

  destroy(): void {
    addons.getChannel().off(SET_CURRENT_STORY, this.reloadInjector);
  }

  protected reloadInjector = (): void => {
    const injector = this.app?.findPlugin(InjectionPlugin);
    injector?.destroy?.();
    injector?.createInjector?.(this.app!);
  };
}
