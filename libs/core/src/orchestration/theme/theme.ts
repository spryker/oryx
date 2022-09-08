import { CSSResult } from 'lit';
import { AppPlugin } from '../app';

export const enum ThemeStrategies {
  Replace = 'replace',
  ReplaceAll = 'replace-all',
}

export interface ThemeData {
  styles: CSSResult[] | string;
  strategy?: ThemeStrategies;
}

export type ThemeImpl = ThemeData | (() => Promise<ThemeData>);

export type Theme = Record<string, ThemeImpl>;

export const ThemePluginName = 'core$theme';

export class ThemePlugin implements AppPlugin {
  constructor(protected themes: Theme[]) {}

  getName(): string {
    return ThemePluginName;
  }

  apply(): void {
    ///
  }

  async resolve(
    name: string,
    componentTheme?: ThemeImpl
  ): Promise<ThemeData[] | null> {
    const implementations = [];

    for (const theme of this.themes) {
      if (!theme[name]) {
        continue;
      }

      implementations.push(this.loadThemeImplFn(theme[name]));
    }

    if (componentTheme) {
      implementations.push(this.loadThemeImplFn(componentTheme));
    }

    const themes = await Promise.all(implementations);

    return themes.length ? themes : null;
  }

  protected loadThemeImplFn(impl?: ThemeImpl): ThemeData | Promise<ThemeData> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (impl as any)();
    } catch {
      return impl as ThemeData;
    }
  }
}
