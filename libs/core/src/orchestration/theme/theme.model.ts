import { CSSResult } from 'lit';

export const enum ThemeStrategies {
  Replace = 'replace',
  ReplaceAll = 'replace-all',
}

export type ThemeStyles = CSSResult | CSSResult[] | string;

export interface ThemeBreakpointsSizes {
  min?: number;
  max?: number;
}

export interface ThemeBreakpoints {
  xs?: ThemeBreakpointsSizes;
  md?: ThemeBreakpointsSizes;
  lg?: ThemeBreakpointsSizes;
}

export interface ThemeMediaQueries {
  mode?: 'dark';
  screen?: keyof ThemeBreakpoints;
}

export type ThemeStylesObj = {
  [T in keyof ThemeBreakpoints]?: ThemeStyles;
};

export interface ThemeData {
  styles: ThemeStylesObj | ThemeStyles;
  strategy?: ThemeStrategies;
}

export type ThemeImpl<T = ThemeData> = T | (() => Promise<T>);

export type ThemeColors = {
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500?: string;
};

export interface ThemeToken {
  [key: string]: ThemeToken | string;
}

export type DesignToken = ThemeToken & {
  media?: ThemeMediaQueries;
  color?: Record<string, string | ThemeColors>;
};

export interface Theme {
  breakpoints?: ThemeBreakpoints;
  components: Record<string, ThemeImpl>;
  icons?: Record<string, ThemeImpl<string>>;
  designTokens?: ThemeImpl<DesignToken[]>;
  globalStyles?: ThemeImpl<(root: string) => string>;
}
