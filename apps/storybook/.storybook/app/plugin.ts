import { App, AppPlugin, InjectionPlugin } from '@spryker-oryx/core';
import { addons } from '@storybook/addons';
import { SET_CURRENT_STORY } from '@storybook/core-events';
import isChromatic from 'chromatic/isChromatic';
import { theme } from './theme';
import { getActiveTheme, SET_STORYBOOK_THEME } from './utils';
// @ts-ignore
import { initializeRTL } from 'storybook-addon-rtl';

export class StorybookPlugin implements AppPlugin {
  protected app?: App;

  getName(): string {
    return 'orchestrator$storybook';
  }

  async apply(app: App): Promise<void> {
    this.app = app;

    if (isChromatic()) {
      await this.resolveIcons();
    }

    initializeRTL();
    addons.getChannel().emit(SET_STORYBOOK_THEME, theme);
    addons.getChannel().on(SET_CURRENT_STORY, this.reloadInjector);
  }

  async resolveIcons(): Promise<void> {
    const themeKey = (getActiveTheme() ??
      theme.default) as keyof typeof theme.list;

    await Promise.all(
      theme.list[themeKey]
        .map((theme) =>
          Object.values(theme.icons ?? {}).map((icon) =>
            typeof icon === 'function' ? (icon as any)() : icon
          )
        )
        .flat()
    );
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
