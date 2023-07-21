import {
  Breakpoint,
  Breakpoints,
  ColorMode,
  CssMediaQueries,
  CssStyles,
  CssStylesWithMedia,
  DefaultMedia,
  getPropByPath,
  resolveLazyLoadable,
} from '@spryker-oryx/utilities';
import { CSSResult, unsafeCSS } from 'lit';
import { Color } from '../../color';
import {
  DesignToken,
  Theme,
  ThemeStyles,
  ThemeStylesCollection,
  ThemeToken,
} from './theme.model';

const enum DesignTokenGlobal {
  Global = 'global',
}

interface DesignTokenMapper {
  [DesignTokenGlobal.Global]?: Record<string, string>;
  [key: string]: Record<string, string> | undefined;
}

type TokensArr = [string, string | ThemeToken, string?][];

export class ThemeTokens {
  protected cssVarPrefix = '--oryx';
  protected mediaMapper = {
    [DefaultMedia.Mode]: {
      dark: 'prefers-color-scheme: dark',
      light: 'prefers-color-scheme: light',
    },
    [DefaultMedia.Screen]: {
      min: 'min-width',
      max: 'max-width',
    },
  };
  protected breakpoints: Breakpoints = {};

  normalizeStyles(styles: CssStyles | ThemeStylesCollection[]): CSSResult[] {
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
  protected generateMedia(value: string): string {
    const path = value.split('.');
    const isScreen = path[0] === DefaultMedia.Screen || path.length === 1;
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
    const mediaRule = getPropByPath(this.mediaMapper, DefaultMedia.Screen);
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

    return expression ? `@media ${expression}` : null;
  }

  protected async getStylesFromTokens(
    themes: Theme[],
    root = ':host'
  ): Promise<ThemeStyles> {
    const modeSelector = (notAttr: string) =>
      root === ':host' ? `${root}(:not([${notAttr}]))` : root;
    const tokens = await this.parseTokens(themes);
    let styles = '';

    for (const media in tokens) {
      const tokensList = tokens[media];

      if (tokensList && !Object.keys(tokensList).length) {
        continue;
      }

      const isMode = media.includes(DefaultMedia.Mode);
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

    for (const tokensObj of tokensList) {
      const tokens = { ...tokensObj };
      let tokenMedia = DesignTokenGlobal.Global as string;

      if (!tokens.media && tokens.color) {
        for (const [key, color] of Object.entries(tokens.color)) {
          // TODO: delete when all colors will be replaced
          const isDeprecated = typeof color === 'string';

          if (isDeprecated) {
            tokensList.push(
              {
                media: { [DefaultMedia.Mode]: 'light' },
                color: { [key]: color },
              },
              {
                media: { [DefaultMedia.Mode]: 'dark' },
                color: { [key]: color },
              }
            );
            continue;
          }

          for (const [tone, value] of Object.entries(color as Color)) {
            tokensList.push({
              media: { [DefaultMedia.Mode]: tone },
              color: { [key]: value },
            });
          }
        }

        delete tokens.color;
      }

      if (tokens.media) {
        for (const key in tokens.media) {
          tokenMedia = `${key}.${tokens.media[key as keyof CssMediaQueries]}`;
        }
        delete tokens.media;
      }

      designTokensMapper[tokenMedia] = {
        ...designTokensMapper[tokenMedia],
      };

      const tokensArr = Object.entries(tokens) as TokensArr;

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
    const stringifiedStyles = (styles: CssStyles): string =>
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
        media = `${key}.${style.media[key as keyof CssMediaQueries]}`;
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
        order.indexOf((a as { media?: CssMediaQueries }).media?.screen ?? '') -
        order.indexOf((b as { media?: CssMediaQueries }).media?.screen ?? '')
    );
  }

  protected isMediaStyles(
    styles: CssStylesWithMedia | CSSResult | string
  ): styles is CssStylesWithMedia {
    return !(styles instanceof CSSResult) && typeof styles !== 'string';
  }

  protected isThemeCollection(
    styles: CssStyles | ThemeStylesCollection[]
  ): styles is ThemeStylesCollection[] {
    return Array.isArray(styles) && styles.some(this.isMediaStyles);
  }
}
