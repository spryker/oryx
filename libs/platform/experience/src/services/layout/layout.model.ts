import { Breakpoint, Size } from '@spryker-oryx/utilities';
import { CSSResult } from 'lit';
import { LayoutPluginType, LayoutTypes } from './plugins';

export interface LayoutStylesOptions extends LayoutProperty {
  type?: LayoutTypes;
}

export type LayoutStyles = {
  /**
   * The layout styles are used for all screen sizes.
   */
  styles?: CSSResult | string;
} & {
  /**
   * Screen specific styles are loaded for the given screen size only; This is rarely used,
   * since styles are written in strict media queries. Together with encapsulated styles the
   * styles won't leak out.
   */
  [key in Size]?: CSSResult | string;
};

export interface ResponsiveLayoutInfo {
  [key: string]: ResponsiveLayout;
}

export interface ResponsiveLayout {
  included?: Breakpoint[];
  excluded?: Breakpoint[];
  type?: LayoutPluginType;
}

export const enum LayoutAlign {
  Start = 'start',
  Stretch = 'stretch',
  End = 'end',
  Center = 'center',
  SpaceBetween = 'space-between',
  SpaceAround = 'space-around',
  SpaceEvenly = 'space-evenly',
}

export const enum CompositionLayoutOrientation {
  horizontal = 'horizontal',
  Vertical = 'vertical',
}
