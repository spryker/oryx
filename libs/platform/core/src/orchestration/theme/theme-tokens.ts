import { resolveLazyLoadable } from '@spryker-oryx/core/utilities';
import { getPropByPath } from '@spryker-oryx/utilities';
import { CSSResult, unsafeCSS } from 'lit';
import {
  Breakpoint,
  ColorMode,
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
    const isScreen = path[0] === ThemeDefaultMedia.Screen || path.length === 1;
    const mediaRule = getPropByPath(this.mediaMapper, value);

    if (isScreen) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.generateScreenMedia(path[1] ?? value)!;
    }

    return `@media (${mediaRule})`;
  }

  generateScreenMedia(
    include: string | string[] = [],
    exclude: string | string[] = []
  ): string | null {
    if (!include?.length && !exclude.length) {
      return null;
    }

    include = Array.isArray(include) ? include : [include];
    exclude = Array.isArray(exclude) ? exclude : [exclude];

    const bpValues = Object.keys(this.breakpoints);
    const values = exclude.length
      ? bpValues.filter(
          (bp) =>
            !exclude.includes(bp) || (include.length && include.includes(bp))
        )
      : include;
    const mediaRule = getPropByPath(this.mediaMapper, ThemeDefaultMedia.Screen);
    const steps = [];

    let expression = '';
    let prevBpIndex = NaN;

    for (const [index, bp] of values.entries()) {
      const dimension = this.breakpoints[bp as Breakpoint];
      const currentIndex = bpValues.findIndex((_bp) => _bp === bp);
      const isFirstStep = index === 0;
      const isORStep = !isNaN(prevBpIndex) && currentIndex - prevBpIndex > 1;
      const isExtendStep =
        !isNaN(prevBpIndex) && currentIndex - prevBpIndex === 1;
      prevBpIndex = bpValues.findIndex((_bp) => _bp === bp);

      if (isFirstStep || isORStep) {
        steps.push({
          min: dimension?.min,
          max: dimension?.max,
        });

        continue;
      }

      if (isExtendStep) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        steps.at(-1)!.max = dimension?.max;
      }
    }

    for (const [index, step] of steps.entries()) {
      expression += index !== 0 ? `, ` : '';
      expression += step?.min ? `(${mediaRule.min}: ${step?.min}px)` : '';
      expression += step?.min && step?.max ? ' and ' : '';
      expression += step?.max ? `(${mediaRule.max}: ${step?.max}px)` : '';
    }

    return `@media ${expression}`;
  }

  protected async getStylesFromTokens(
    themes: Theme[],
    root = ':host'
  ): Promise<ThemeData> {
    const modeSelector = (notAttr: string) =>
      root === ':host' ? `${root}(:not([${notAttr}]))` : root;
    const tokens = await this.parseTokens(themes);
    let styles = '';

    for (const media in tokens) {
      const tokensList = tokens[media];

      if (tokensList && !Object.keys(tokensList).length) {
        continue;
      }

      const isMode = media.includes(ThemeDefaultMedia.Mode);
      let start = '';
      let end = '}';

      if (media !== DesignTokenGlobal.Global && !isMode) {
        end += '}';
        start += ` ${this.generateMedia(media)} {`;
      }

      if (isMode) {
        const isLight = media.includes('light');
        const modeOrder = isLight
          ? `@layer mode.dark, ${media};`
          : `@layer mode.light, ${media};`;
        const attr = media.replace('.', '-');
        const mode = modeSelector(isLight ? ColorMode.Dark : ColorMode.Light);
        const mediaMode = this.generateMedia(media);

        end += '}';
        start += ` ${mediaMode} { ${modeOrder} } @layer ${media} { [${attr}],${mode} {`;
      } else {
        start += ` ${root} {`;
      }

      for (const key in tokensList) {
        start += `${key}: ${tokensList[key]};`;
      }

      styles += `${start}${end}`;
    }

    return { styles };
  }

  protected async parseTokens(themes: Theme[]): Promise<DesignTokenMapper> {
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

      if (!tokens.media && tokens.color) {
        tokensList.push({
          media: { [ThemeDefaultMedia.Mode]: 'light' },
          color: tokens.color,
        });
        delete tokens.color;
      }

      if (tokens.media) {
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

    return designTokensMapper;
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
