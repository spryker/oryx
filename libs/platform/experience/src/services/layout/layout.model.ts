import { Breakpoint, Size } from '@spryker-oryx/utilities';
import { CSSResult } from 'lit';

export type LayoutStyles = {
  /**
   * The layout styles are used for all screen sizes.
   */
  styles?: CSSResult;
} & {
  /**
   * Screen specific styles are loaded for the given screen size only; This is rarely used,
   * since styles are written in strict media queries. Together with encapsulated styles the
   * styles won't leak out.
   */
  [key in Size]?: CSSResult;
};

export interface ResponsiveLayoutInfo {
  [key: string]: ResponsiveLayout;
}

export interface ResponsiveLayout {
  included?: Breakpoint[];
  excluded?: Breakpoint[];
}
