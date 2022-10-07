import { HOOKS_KEY, IconHookToken } from '@spryker-oryx/utilities';
import { CSSResult, unsafeCSS } from 'lit';
import { iconHook } from '../../hooks';
import { App, AppPlugin, AppPluginBeforeApply } from '../app';
import { ComponentsPlugin } from '../components';

export const enum ThemeStrategies {
  Replace = 'replace',
  ReplaceAll = 'replace-all',
}

export type ThemeStyles = CSSResult | CSSResult[] | string;

export interface ThemeData {
  styles: ThemeStyles;
  strategy?: ThemeStrategies;
}

export type ThemeImpl<T = ThemeData> = T | (() => Promise<T>);

export type Theme = {
  components: Record<string, ThemeImpl>;
  icons?: Record<string, ThemeImpl<string>>;
};

export const ThemePluginName = 'core$theme';

export class ThemePlugin implements AppPlugin, AppPluginBeforeApply {
  protected app?: App;
  protected icons = {};

  constructor(protected themes: Theme[]) {}

  getName(): string {
    return ThemePluginName;
  }

  beforeApply(app: App): void | Promise<void> {
    this.app = app;
  }

  apply(): void {
    ///
  }

  transformer(theme: ThemeStyles): CSSResult[] {
    if (typeof theme === 'string') {
      return [unsafeCSS(theme)];
    }

    return Array.isArray(theme) ? theme : [theme];
  }

  async resolve(
    name: string,
    componentTheme?: ThemeImpl
  ): Promise<ThemeData[] | null> {
    const implementations: (ThemeData | Promise<ThemeData>)[] = [];
    const componentPlugin = this.app?.findPlugin(ComponentsPlugin);
    const isIconExtended = componentPlugin?.options[HOOKS_KEY]?.[IconHookToken];

    for (const theme of this.themes) {
      const component = theme.components[name];

      if (theme.icons) {
        this.icons = {
          ...this.icons,
          ...theme.icons,
        };
      }

      if (theme.icons && !isIconExtended) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        componentPlugin!.options[HOOKS_KEY] = {
          ...(componentPlugin?.options[HOOKS_KEY] ?? {}),
          [IconHookToken]: iconHook,
        };
      }

      if (!component) {
        continue;
      }

      implementations.push(this.loadThemeImplFn(component));
    }

    if (componentTheme) {
      implementations.push(this.loadThemeImplFn(componentTheme));
    }

    const themes = await Promise.all(implementations);

    return themes.length ? themes : null;
  }

  async getIcon(icon?: string): Promise<string | void> {
    const iconImpl = this.icons?.[icon as keyof typeof this.icons];

    if (!iconImpl) {
      return;
    }

    return await this.loadThemeImplFn(iconImpl);
  }

  protected loadThemeImplFn<T>(impl?: ThemeImpl): T | Promise<T> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (impl as any)();
    } catch {
      return impl as unknown as T;
    }
  }
}
