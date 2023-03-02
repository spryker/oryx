import { resolveLazyLoadable } from '@spryker-oryx/core/utilities';
import { getPropByPath } from '@spryker-oryx/utilities';
import { CSSResult, unsafeCSS } from 'lit';
import {
  DesignToken,
  Theme,
  ThemeBreakpoints,
  ThemeData,
  ThemeDefaultMedia,
  ThemeMediaQueries,
  ThemeStyles,
  ThemeStylesCollection,
  ThemeStylesWithMedia,
  ThemeToken,
} from './theme.model';

const enum DesignTokenGlobal {
  Global = 'global',
}

interface DesignTokenMapper {
  [DesignTokenGlobal.Global]?: Record<string, string>;
  [key: string]: Record<string, string> | undefined;
}

export class ThemeTokens {
  protected cssVarPrefix = '--oryx';
  protected mediaMapper = {
    [ThemeDefaultMedia.Mode]: {
      dark: 'prefers-color-scheme: dark',
      light: 'prefers-color-scheme: light',
    },
    [ThemeDefaultMedia.Screen]: {
      min: 'min-width',
      max: 'max-width',
    },
  };
  protected breakpoints: ThemeBreakpoints = {};

  normalizeStyles(styles: ThemeStyles | ThemeStylesCollection[]): CSSResult[] {
    if (this.isThemeCollection(styles)) {
      return this.getStylesFromCollection(styles);
    }

    if (typeof styles === 'string') {
      return [unsafeCSS(styles)];
    }

    return Array.isArray(styles) ? styles : [styles];
  }

  /**
   * Interpolates value from {@link mediaMapper} by value path.
   * Value path should be separated by a dot. (e.g. `mode.dark` => `@media (prefers-color-scheme: dark)`)
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

  protected async getStylesFromTokens(
    themes: Theme[],
    root = ':host'
  ): Promise<ThemeData> {
    const designTokensMapper: DesignTokenMapper = {};
    const generateCssVarKey = (
      currentKey: string,
      parentKey?: string
    ): string => (parentKey ? `${parentKey}-${currentKey}` : currentKey);
    const tokensList: DesignToken[] = [];

    for (const theme of themes) {
      const designTokens = await resolveLazyLoadable(theme.designTokens);

      if (!designTokens) {
        continue;
      }

      this.sortByBreakpoints(designTokens);
      tokensList.push(...designTokens);
    }

    for (const tokens of tokensList) {
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

    let stream = '';

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

  protected getStylesFromCollection(
    styles: ThemeStylesCollection[]
  ): CSSResult[] {
    this.sortByBreakpoints(styles);
    const stringifiedStyles = (styles: ThemeStyles): string =>
      this.normalizeStyles(styles).reduce(
        (acc, style) => `${acc} ${style.toString()}`,
        ''
      );

    let stylesStream = '';

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
        style.css
      )}}`;
    }

    return [unsafeCSS(stylesStream)];
  }

  protected sortByBreakpoints(
    styles: DesignToken[] | ThemeStylesCollection[]
  ): void {
    const order = Object.keys(this.breakpoints);

    styles.sort(
      (a, b) =>
        order.indexOf(
          (a as { media?: ThemeMediaQueries }).media?.screen ?? ''
        ) -
        order.indexOf((b as { media?: ThemeMediaQueries }).media?.screen ?? '')
    );
  }

  protected isMediaStyles(
    styles: ThemeStylesWithMedia | CSSResult | string
  ): styles is ThemeStylesWithMedia {
    return !(styles instanceof CSSResult) && typeof styles !== 'string';
  }

  protected isThemeCollection(
    styles: ThemeStyles | ThemeStylesCollection[]
  ): styles is ThemeStylesCollection[] {
    return Array.isArray(styles) && styles.some(this.isMediaStyles);
  }
}
