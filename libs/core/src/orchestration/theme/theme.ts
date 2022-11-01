import {
  getPropByPath,
  HOOKS_KEY,
  IconHookToken,
  isPromise,
} from '@spryker-oryx/utilities';
import { CSSResult, unsafeCSS } from 'lit';
import { iconHook } from '../../hooks';
import { App, AppPlugin, AppPluginBeforeApply } from '../app';
import { ComponentsPlugin } from '../components';
import {
  DesignToken,
  Theme,
  ThemeBreakpoints,
  ThemeData,
  ThemeImpl,
  ThemeMediaQueries,
  ThemeStyles,
  ThemeStylesObj,
  ThemeToken,
} from './theme.model';

interface ThemeMappedToken {
  tokens: DesignToken;
}

const enum DesignTokenGlobal {
  Global = 'global',
}

interface DesignTokenMapper {
  [DesignTokenGlobal.Global]?: Record<string, string>;
  [key: string]: Record<string, string> | undefined;
}

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
  protected breakpoints: ThemeBreakpoints = {};
  protected mediaMapper: Record<
    keyof ThemeMediaQueries,
    Record<string, string>
  > = {
    mode: {
      dark: 'prefers-color-scheme: dark',
    },
    screen: {
      min: 'min-width',
      max: 'max-width',
    },
  };

  constructor(protected themes: Theme[]) {
    this.propertiesCollector(themes);
  }

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

  normalizeStyles(styles: ThemeStyles | ThemeStylesObj): CSSResult[] {
    if (this.isThemeStyles(styles)) {
      return this.normalizer(styles);
    }

    return this.generateBreakpoints(styles);
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

  protected async setStyles(root = ':host'): Promise<ThemeData> {
    let stream = '';
    const designTokensMapper: DesignTokenMapper = {};
    const replaced: (Theme | ThemeMappedToken)[] = [...this.themes];
    const isTokens = (arg: Theme | ThemeMappedToken): arg is ThemeMappedToken =>
      !!(arg as ThemeMappedToken).tokens;
    const generateCssVarKey = (
      currentKey: string,
      parentKey?: string
    ): string => (parentKey ? `${parentKey}-${currentKey}` : currentKey);
    const breakpointsOrder = Object.keys(this.breakpoints);

    for (let i = 0; i < replaced.length; i++) {
      const theme = replaced[i];

      if (!isTokens(theme)) {
        const { designTokens, globalStyles } = theme;
        const [styles, tokensArr = []] = await Promise.all([
          this.loadThemeImplFn(globalStyles),
          this.loadThemeImplFn(designTokens),
        ]);

        stream += styles ? `${styles(root)}` : '';
        tokensArr.sort(
          (a, b) =>
            breakpointsOrder.indexOf(a.media?.screen ?? '') -
            breakpointsOrder.indexOf(b.media?.screen ?? '')
        );

        for (let i = 0; i < tokensArr.length; i++) {
          replaced.push({ tokens: { ...tokensArr[i] } });
        }

        continue;
      }

      const { tokens } = theme;
      let tokenMedia = DesignTokenGlobal.Global as string;

      if (tokens?.media) {
        for (const key in tokens.media) {
          tokenMedia = `${key}.${tokens.media[key as keyof ThemeMediaQueries]}`;
        }
        delete tokens.media;
      }

      designTokensMapper[tokenMedia] = {
        ...designTokensMapper[tokenMedia],
      };

      const tokensArr: [string, string | ThemeToken, string?][] =
        Object.entries(tokens);

      for (let i = 0; i < tokensArr.length; i++) {
        const [key, token, parentKey] = tokensArr[i];

        if (typeof token === 'string') {
          const tokenKey = `${this.cssVarPrefix}-${generateCssVarKey(
            key,
            parentKey
          )}`;

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          designTokensMapper[tokenMedia]![tokenKey] = token;

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
    }

    for (const media in designTokensMapper) {
      const tokensList = designTokensMapper[media];
      let start = '';
      let end = '}';

      if (media !== DesignTokenGlobal.Global) {
        end += '}';
        start += this.generateMedia(media);
      }

      start += ` ${root} {`;

      for (const key in tokensList) {
        start += `${key}: ${tokensList[key]};`;
      }

      stream += `${start}${end}`;
    }

    return {
      styles: stream,
    };
  }

  protected generateBreakpoints(styles: ThemeStylesObj): CSSResult[] {
    let stylesStream = '';

    for (const breakpoint in this.breakpoints) {
      const stylesByBP = styles[breakpoint as keyof ThemeStylesObj];

      if (!stylesByBP) {
        continue;
      }

      const themeStyles = this.normalizer(stylesByBP).reduce(
        (acc, style) => `${acc} ${style.toString()}`,
        ''
      );

      stylesStream += `${this.generateMedia(
        `screen.${breakpoint}`
      )}${themeStyles}}`;
    }

    return [unsafeCSS(stylesStream)];
  }

  protected propertiesCollector(themes: Theme[]): void {
    for (const { breakpoints, icons } of themes) {
      const sortableBP = Object.fromEntries(
        Object.entries(breakpoints ?? {}).sort(([, a], [, b]) => a.min - b.min)
      );

      this.breakpoints = {
        ...this.breakpoints,
        ...sortableBP,
      };

      this.icons = {
        ...this.icons,
        ...icons,
      };
    }
  }

  protected isThemeStyles(
    styles: ThemeStyles | ThemeStylesObj
  ): styles is ThemeStyles {
    return (
      typeof styles === 'string' ||
      styles instanceof CSSResult ||
      Array.isArray(styles)
    );
  }

  protected normalizer(theme: ThemeStyles): CSSResult[] {
    if (typeof theme === 'string') {
      return [unsafeCSS(theme)];
    }

    return Array.isArray(theme) ? theme : [theme];
  }

  /**
   * Interpolates value from {@link mediaMapper} by value path.
   * Value path should be separated by a dot. (e.g. `mode.dark`)
   */
  protected generateMedia(value: string): string {
    const path = value.split('.');
    const isScreen = path[0] === 'screen';
    const mediaKey = getPropByPath(
      this.mediaMapper,
      isScreen ? 'screen' : value
    );
    const media = (expression: string): string => ` @media ${expression} {`;

    if (isScreen && this.breakpoints) {
      const dimension = this.breakpoints[path[1] as keyof ThemeBreakpoints];
      let expression = dimension?.min
        ? `(${mediaKey.min}: ${dimension?.min}px)`
        : '';
      expression += dimension?.min && dimension?.max ? ' and ' : '';
      expression += dimension?.max
        ? `(${mediaKey.max}: ${dimension?.max}px)`
        : '';

      return media(expression);
    }

    return media(`(${mediaKey})`);
  }

  protected loadThemeImplFn<T>(impl?: ThemeImpl<T>): T | Promise<T> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (impl as any)();

      return (isPromise(value) ? value : impl) as T;
    } catch {
      return impl as unknown as T;
    }
  }
}
