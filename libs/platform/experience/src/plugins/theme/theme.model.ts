import { LazyLoadable } from '@spryker-oryx/core/utilities';
import {
  Breakpoints,
  CssMediaQueries,
  CssStyles,
  CssStylesWithMedia,
} from '@spryker-oryx/utilities';
import { CSSResult } from 'lit';

declare module '@spryker-oryx/core' {
  interface ComponentMap {
    themes?: (ThemeData | ThemeStylesheets)[] | null;
  }

  interface ComponentDef {
    readonly stylesheets?: ComponentTheme[];
  }
}

export interface ComponentTheme {
  theme?: string;
  rules: LazyLoadable<ThemeData | ThemeStylesheets>;
}

export const enum ThemeStrategies {
  Replace = 'replace',
  ReplaceAll = 'replace-all',
}

export type ThemeStylesCollection =
  | Exclude<CssStyles, CSSResult[]>
  | CssStylesWithMedia;

export type ThemeStylesheets = CssStyles | ThemeStylesCollection[];

export interface ThemeData {
  styles: ThemeStylesheets;
  strategy?: ThemeStrategies;
}

export interface ThemeToken {
  [key: string]: ThemeToken | string;
}

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

export const enum TempColorMode {
  Light = 'light',
  Dark = 'dark',
}

export type Color = {
  [mode in TempColorMode]?: {
    [tone in ColorTone]?: string;
  };
};

export type ColorPalette = Record<string, Color>;

/** @deprecated */
export type ThemeColors = {
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500?: string;
};

export type ColorDesignTokens = Record<string, string | ThemeColors | Color>;

export type DesignToken = ThemeToken & {
  media?: CssMediaQueries;
  color?: ColorDesignTokens;
};

export type ThemeComponents = Record<string, LazyLoadable<ThemeData>>;
export type ThemeIcons = Record<string, LazyLoadable<string>>;
export type ThemeDesignTokens = LazyLoadable<DesignToken[]>;
export type ThemeGlobalStyles = LazyLoadable<(root: string) => string>;

export interface Theme {
  name: string;
  breakpoints?: Breakpoints;
  icons?: ThemeIcons;
  designTokens?: ThemeDesignTokens;
}
