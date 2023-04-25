import { LazyLoadable, ScreenSize } from '@spryker-oryx/core/utilities';
import { Size } from '@spryker-oryx/utilities';

import { CSSResult } from 'lit';

export const enum ThemeStrategies {
  Replace = 'replace',
  ReplaceAll = 'replace-all',
}

export type ThemeStyles = CSSResult | CSSResult[] | string;

export const enum ThemeDefaultMedia {
  Screen = 'screen',
  Mode = 'mode',
}

export interface ThemeBreakpoints {
  [Size.Sm]?: ScreenSize;
  [Size.Md]?: ScreenSize;
  [Size.Lg]?: ScreenSize;
}

export interface ThemeMediaQueries {
  [ThemeDefaultMedia.Mode]?: 'dark';
  [ThemeDefaultMedia.Screen]?: keyof ThemeBreakpoints;
}

export interface ThemeStylesWithMedia {
  media: ThemeMediaQueries;
  css: ThemeStyles;
}

export type ThemeStylesCollection = CSSResult | string | ThemeStylesWithMedia;

export type ThemeStylesheets = ThemeStyles | ThemeStylesCollection[];

export interface ThemeData {
  styles: ThemeStylesheets;
  strategy?: ThemeStrategies;
}

// export type ThemeColors = {
//   100?: string;
//   200?: string;
//   300?: string;
//   400?: string;
//   500?: string;
// };

export interface ThemeToken {
  [key: string]: ThemeToken | string;
}

export type DesignToken = ThemeToken & {
  media?: ThemeMediaQueries;
  color?: ColorDesignTokens;
};

export type ThemeComponents = Record<string, LazyLoadable<ThemeData>>;
export type ThemeIcons = Record<string, LazyLoadable<string>>;
export type ThemeDesignTokens = LazyLoadable<DesignToken[]>;
export type ThemeGlobalStyles = LazyLoadable<(root: string) => string>;

export interface Theme {
  name: string;
  breakpoints?: ThemeBreakpoints;
  icons?: ThemeIcons;
  designTokens?: ThemeDesignTokens;
}

// TODO: move the following to experience/color/color.model.ts
export const enum ColorTone {
  Canvas,
  Background,
  BackgroundSubtle,
  ElementBackground,
  ElementHover,
  ElementActive,
  Separator,
  Border,
  BorderHover,
  Solid,
  SolidHOver,
  LowContrast,
  HighContrast,
}

export const enum ColorMode {
  Light = 'light',
  Dark = 'dark',
}

export type Color = {
  [mode in ColorMode]?: {
    [tone in ColorTone]?: string;
  };
};

export type ColorPalette = { [color: string]: Color };

/** @deprecated */
export type ThemeColors = {
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500?: string;
};

export type ColorDesignTokens = Record<string, string | ThemeColors | Color>;
