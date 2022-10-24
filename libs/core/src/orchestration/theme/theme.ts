import { HOOKS_KEY, IconHookToken } from '@spryker-oryx/utilities';
import { CSSResult, unsafeCSS } from 'lit';
import { iconHook } from '../../hooks';
import { App, AppPlugin, AppPluginBeforeApply } from '../app';
import { ComponentsPlugin } from '../components';
import {
  DesignToken,
  Theme,
  ThemeData,
  ThemeImpl,
  ThemeMediaQueries,
  ThemeStyles,
  ThemeToken,
} from './theme.model';

export const ThemePluginName = 'core$theme';

/**
 * Resolves components styles from theme options.
 * Adds design tokens and global styles to the root component of into body inside style tag.
 * Resolves icons from theme options.
 * Changes static method by token {@link IconHookToken} for custom core implementation.
 */
export class ThemePlugin implements AppPlugin, AppPluginBeforeApply {
  protected app?: App;
  protected icons = {};
  protected cssVarPrefix = '--oryx';

  constructor(protected themes: Theme[]) {}

  getName(): string {
    return ThemePluginName;
  }

  beforeApply(app: App): void | Promise<void> {
    this.app = app;
  }

  async apply(): Promise<void> {
    const componentPlugin = this.app?.findPlugin(ComponentsPlugin);

    if (typeof componentPlugin?.options.root === 'string' && document.body) {
      const styles = document.createElement('style');
      const streamStyles = await this.setStyles(':root:not([no-dark-mode])');
      styles.innerHTML = streamStyles.styles as string;
      document.body.prepend(styles);
    }
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

    if (componentPlugin?.rootSelector === name) {
      implementations.unshift(this.setStyles());
    }

    const themes = await Promise.all(implementations);

    return themes.length ? themes : null;
  }

  async getIcon(icon?: string): Promise<string | void> {
    const iconImpl = this.getIconTemplate(icon);

    if (!iconImpl) {
      return;
    }

    return await this.loadThemeImplFn<string>(iconImpl);
  }

  getIconTemplate(icon?: string): ThemeImpl<string> | void {
    return this.icons?.[icon as keyof typeof this.icons];
  }

  protected async setStyles(selector = ':host'): Promise<ThemeData> {
    let stream = '';
    const replaced: (Theme | Record<'tokens', DesignToken>)[] = [
      ...this.themes,
    ];
    const isTokens = (
      arg: Theme | Record<'tokens', DesignToken>
    ): arg is Record<'tokens', DesignToken> =>
      arg['tokens' as keyof typeof arg];
    const generateCssVarKey = (
      currentKey: string,
      parentKey?: string
    ): string => (parentKey ? `${parentKey}-${currentKey}` : currentKey);
    // TODO; should be common mechanism for media queries generation
    const mediaQueryMapper: Record<
      keyof ThemeMediaQueries,
      Record<string, string>
    > = {
      mode: {
        dark: 'prefers-color-scheme: dark',
      },
    };

    for (let i = 0; i < replaced.length; i++) {
      const theme = replaced[i];

      if (!isTokens(theme)) {
        const { designTokens, globalStyles } = theme;
        const [styles = '', tokensArr = []] = await Promise.all([
          this.loadThemeImplFn(globalStyles),
          this.loadThemeImplFn(designTokens),
        ]);

        stream += `${styles}`;

        for (let i = 0; i < tokensArr.length; i++) {
          replaced.push({ tokens: tokensArr[i] });
        }

        continue;
      }

      const { tokens } = theme;
      let start = '';
      let end = '}';

      if (tokens?.mediaQuery) {
        start += '@media ';
        end += '}';

        for (const key in tokens.mediaQuery) {
          start += `(${
            mediaQueryMapper[key as keyof ThemeMediaQueries]?.[
              tokens.mediaQuery[key as keyof ThemeMediaQueries] as string
            ]
          }) {`;
        }

        delete tokens.mediaQuery;
      }

      start += `${selector} {`;
      const tokensArr: [string, string | ThemeToken, string?][] =
        Object.entries(tokens);

      for (let i = 0; i < tokensArr.length; i++) {
        const [key, token, parentKey] = tokensArr[i];

        if (typeof token === 'string') {
          start += `${this.cssVarPrefix}-${generateCssVarKey(
            key,
            parentKey
          )}: ${token};`;

          continue;
        }

        for (const subKey in token) {
          tokensArr.push([
            subKey,
            token[subKey],
            generateCssVarKey(key, parentKey),
          ]);
        }
      }

      stream += `${start}${end}`;
    }

    return {
      styles: stream,
    };
  }

  protected loadThemeImplFn<T>(impl?: ThemeImpl<T>): T | Promise<T> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (impl as any)();
    } catch {
      return impl as unknown as T;
    }
  }
}
