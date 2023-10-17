import { Breakpoint, Size } from '@spryker-oryx/utilities';
import { CSSResult } from 'lit';
import { LayoutPluginType } from './plugins';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Layouts {}

  export interface LayoutsProperty {
    vertical?: boolean;
  }
}

export type LayoutTypes = keyof Layouts | 'list';

export interface LayoutStylesProperties {
  layout?:
    | (LayoutsProperty & {
        type?: LayoutTypes;
      })
    | LayoutTypes
    // @deprecated since 1.2
    | string;

  // @deprecated since 1.2 will be removed.
  vertical?: boolean;
  // @deprecated since 1.2 will be removed.
  sticky?: boolean;
  // @deprecated since 1.2 will be removed.
  overlap?: boolean;
  // @deprecated since 1.2 will be removed.
  bleed?: boolean;
  // @deprecated since 1.2 will be removed.
  divider?: boolean;
}

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
  type: LayoutPluginType;
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
