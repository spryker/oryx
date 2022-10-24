import { CSSResult } from 'lit';

export const enum ThemeStrategies {
  Replace = 'replace',
  ReplaceAll = 'replace-all',
}

export type ThemeStyles = CSSResult | CSSResult[] | string;

export interface ThemeData {
  styles: ThemeStyles;
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

export interface ThemeMediaQueries {
  mode?: 'dark';
}

export type DesignToken = ThemeToken & {
  mediaQuery?: ThemeMediaQueries;
  color?: Record<string, string | ThemeColors>;
};

export interface Theme {
  components: Record<string, ThemeImpl>;
  icons?: Record<string, ThemeImpl<string>>;
  designTokens?: ThemeImpl<DesignToken[]>;
  globalStyles?: ThemeImpl<string>;
}
