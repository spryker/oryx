import {
  getPropByPath,
  HOOKS_KEY,
  IconHookToken,
  isPromise,
} from '@spryker-oryx/utilities';
import { CSSResult, unsafeCSS } from 'lit';
import { iconHook } from '../../hooks';
import { App, AppPlugin, AppPluginBeforeApply } from '../app';
import { ComponentsPlugin, ComponentTheme } from '../components';
import {
  DesignToken,
  LazyLoadable,
  Theme,
  ThemeBreakpoints,
  ThemeData,
  ThemeDefaultMedia,
  ThemeIcons,
  ThemeMediaQueries,
  ThemeStyles,
  ThemeStylesCollection,
  ThemeStylesWithMedia,
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
  protected breakpoints: Partial<ThemeBreakpoints> = {};
  protected breakpointsOrder: string[] = [];
  protected app?: App;
  protected icons = Object.create(null);
  protected cssVarPrefix = '--oryx';
  protected mediaMapper: Record<
    keyof ThemeMediaQueries,
    Record<string, string>
  > = {
    [ThemeDefaultMedia.Mode]: {
      dark: 'prefers-color-scheme: dark',
    },
    [ThemeDefaultMedia.Screen]: {
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

  getIconsList(): ThemeIcons {
    return this.icons;
  }

  async apply(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    const componentOptions = this.app?.findPlugin(ComponentsPlugin)!.options!;
    const isIconExtended = componentOptions[HOOKS_KEY]?.[IconHookToken];

    if (Object.keys(this.icons).length && !isIconExtended) {
      componentOptions[HOOKS_KEY] = {
        ...(componentOptions[HOOKS_KEY] ?? {}),
        [IconHookToken]: iconHook,
      };
    }

    if (typeof componentOptions.root === 'string' && document.body) {
      const styles = document.createElement('style');
      const streamStyles = await this.setStyles(':root:not([no-dark-mode])');
      styles.innerHTML = streamStyles.styles as string;
      document.body.prepend(styles);
    }
  }

  normalizeStyles(styles: ThemeStyles | ThemeStylesCollection[]): CSSResult[] {
    if (this.isThemeCollection(styles)) {
      return this.generateBreakpoints(styles);
    }

    return this.normalizer(styles);
  }

  async resolve(
    name: string,
    componentThemes: ComponentTheme[] = []
  ): Promise<ThemeData[] | null> {
    const implementations: (ThemeData | Promise<ThemeData>)[] = [];
    const componentPlugin = this.app?.findPlugin(ComponentsPlugin);

    for (const componentTheme of componentThemes) {
      const component = this.themes.find(
        (theme) => componentTheme.name === theme.name
      );

      if (!component) {
        continue;
      }

      implementations.push(this.loadThemeImplFn(componentTheme.styles));
    }

    if (componentPlugin?.rootSelector === name) {
      implementations.unshift(this.setStyles());
    }

    const themes = await Promise.all(implementations);

    return themes.length ? themes : null;
  }

  async getIcon(icon?: string): Promise<string | void> {
    const iconImpl = this.icons?.[icon as keyof typeof this.icons];

    if (!iconImpl) {
      return;
    }

    return await this.loadThemeImplFn<string>(iconImpl);
  }

  getIconTemplate(icon?: string): LazyLoadable<string> | void {
    return this.icons?.[icon as keyof typeof this.icons];
  }

  getBreakpoints(): ThemeBreakpoints {
    return this.breakpoints as ThemeBreakpoints;
  }

  /**
   * Interpolates value from {@link mediaMapper} by value path.
   * Value path should be separated by a dot. (e.g. `mode.dark`)
   */
  generateMedia(value: string): string {
    const path = value.split('.');
    const isScreen = path[0] === ThemeDefaultMedia.Screen;
    const mediaKey = getPropByPath(
      this.mediaMapper,
      isScreen ? ThemeDefaultMedia.Screen : value
    );
    const media = (expression: string): string => `@media ${expression}`;

    if (isScreen && this.breakpoints) {
      const dimension = this.breakpoints[path[1] as keyof ThemeBreakpoints];
      let expression = dimension?.min?.toString()
        ? `(${mediaKey.min}: ${dimension?.min}px)`
        : '';
      expression +=
        dimension?.min?.toString() && dimension?.max?.toString() ? ' and ' : '';
      expression += dimension?.max?.toString()
        ? `(${mediaKey.max}: ${dimension?.max}px)`
        : '';

      return media(expression);
    }

    return media(`(${mediaKey})`);
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

    for (let i = 0; i < replaced.length; i++) {
      const theme = replaced[i];

      if (!isTokens(theme)) {
        const { designTokens } = theme;
        const tokensArr = await this.loadThemeImplFn(designTokens);

        if (!tokensArr) {
          continue;
        }

        this.sortByBreakpoints(tokensArr);

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
        start += ` ${this.generateMedia(media)} {`;
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

  protected generateBreakpoints(styles: ThemeStylesCollection[]): CSSResult[] {
    let stylesStream = '';
    this.sortByBreakpoints(styles);
    const stringifiedStyles = (styles: ThemeStyles): string =>
      this.normalizer(styles).reduce(
        (acc, style) => `${acc} ${style.toString()}`,
        ''
      );

    for (const style of styles) {
      if (!this.isMediaStyles(style)) {
        stylesStream += ` ${stringifiedStyles(style)}`;

        continue;
      }

      let media = '';

      for (const key in style.media) {
        media = `${key}.${style.media[key as keyof ThemeMediaQueries]}`;
      }

      stylesStream += ` ${this.generateMedia(media)} {${stringifiedStyles(
        style.styles
      )}}`;
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

    this.breakpointsOrder = Object.keys(this.breakpoints);
  }

  protected isThemeCollection(
    styles: ThemeStyles | ThemeStylesCollection[]
  ): styles is ThemeStylesCollection[] {
    return Array.isArray(styles) && styles.some(this.isMediaStyles);
  }

  protected isMediaStyles(
    styles: ThemeStylesWithMedia | CSSResult | string
  ): styles is ThemeStylesWithMedia {
    return !(styles instanceof CSSResult) && typeof styles !== 'string';
  }

  protected sortByBreakpoints(
    styles: DesignToken[] | ThemeStylesCollection[]
  ): void {
    styles.sort(
      (a, b) =>
        this.breakpointsOrder.indexOf(
          (a as { media?: ThemeMediaQueries }).media?.screen ?? ''
        ) -
        this.breakpointsOrder.indexOf(
          (b as { media?: ThemeMediaQueries }).media?.screen ?? ''
        )
    );
  }

  protected normalizer(theme: ThemeStyles): CSSResult[] {
    if (typeof theme === 'string') {
      return [unsafeCSS(theme)];
    }

    return Array.isArray(theme) ? theme : [theme];
  }

  protected loadThemeImplFn<T>(impl?: LazyLoadable<T>): T | Promise<T> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (impl as any)();

      return (isPromise(value) ? value : impl) as T;
    } catch {
      return impl as unknown as T;
    }
  }
}
