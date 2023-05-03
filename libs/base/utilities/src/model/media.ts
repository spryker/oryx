import { CSSResult } from 'lit';
import { Size } from './size';

export type CssStyles = CSSResult | CSSResult[] | string;

export const enum DefaultMedia {
  Screen = 'screen',
  Mode = 'mode',
}

/**
 * The screen size definition is used to build a (CSS) media query.
 * The min and max values are optional, and define the so-called
 * _breakpoint_ of the layout.
 */
export interface ScreenSize {
  /**
   * The minimum screen size in pixels. If not provided, the layout rules
   * for this screen will start from `0`.
   */
  min?: number;
  /**
   * The maximum screen size in pixels. If not provided, the layout rules
   * for this screen will not be limited to a max size.
   */
  max?: number;
}

export interface Breakpoints {
  [Size.Xs]?: ScreenSize;
  [Size.Sm]?: ScreenSize;
  [Size.Md]?: ScreenSize;
  [Size.Lg]?: ScreenSize;
  [Size.Xl]?: ScreenSize;
}

export type Breakpoint = keyof Breakpoints;

export enum ColorId {
  Light = 'light',
  Dark = 'dark',
}

export enum ColorMode {
  Light = 'mode-light',
  Dark = 'mode-dark',
}

export interface CssMediaQueries {
  [DefaultMedia.Mode]?: ColorId | string;
  [DefaultMedia.Screen]?: Breakpoint | string;
}

export interface CssStylesWithMedia {
  media: CssMediaQueries;
  css: CssStyles;
}
