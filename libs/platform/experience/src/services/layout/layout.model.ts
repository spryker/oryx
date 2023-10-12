import { HeadingTag } from '@spryker-oryx/ui/heading';
import { Breakpoint, Size } from '@spryker-oryx/utilities';
import { CSSResult } from 'lit';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface PluggableLayouts {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface PluggableLayoutProperties {}
}

export type LayoutTypes = keyof PluggableLayouts | string;

export type LayoutStylesProperties = {
  [P in keyof PluggableLayoutProperties as `layout${Capitalize<P>}`]?: PluggableLayoutProperties[P];
} & {
  layoutVertical?: boolean;
  // @deprecated since 1.2 will be removed.
  vertical?: boolean;
  sticky?: boolean;
  overlap?: boolean;
  bleed?: boolean;
  divider?: boolean;
};

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

export interface StyleProperties extends LayoutStylesProperties {
  /**
   * The column count is based on a calculated count by design tokens, which can be specified
   * by design tokens. This results in a column system for grid and carousels that uses 4, 2
   * or 1 columns for large, medium and small screens.
   *
   * While the column system can be configured globally by design tokens, the `columnCount` allows
   * for an individual override per layout.
   *
   * It is also worth mentioning that nested layouts will inherit the column size from the parent
   * layout, by taken the parent item _span_ count, which default to `1`. This results in a
   * balanced layout, where nested layouts will reflect the parent column setup.
   */
  columnCount?: number;

  /**
   * The align property is applied to the child items as well as to the layout it self. This
   * allows to align the child items over the layout axis. In most layouts, this means that
   * child items are aligned over the vertical axis. For example, the item(s) are stretched
   * or centered.
   */
  align?: LayoutAlign | string;
  justify?: LayoutAlign | string;

  /**
   * Makes it possible for an element to span across the given columns or rows.
   *
   * The span size might exceed the available columns, due to the dynamic/responsive
   * behaviour of the layout. Whenever the span is applied, it is therefore combined
   * with the maximum available columns to span.
   */
  span?: number;
  colSpan?: number;
  rowSpan?: number;

  /**
   * Allows to specify the location of the grid row. This overrules the automated
   * flow of the grid system.
   *
   * A separate grid item that is used in combination with a list of items can interfere with
   * this property with the list, i.e. by setting the `gridRow` to 2, it will be nested inside
   * the list on the 2nd row.
   */
  gridRow?: number;

  /**
   * Allows to specify the location of the grid column. This overrules the automated
   * flow of the grid system.
   *
   * A separate grid item that is used in combination with a list of items can interfere with
   * this property with the list, i.e. by setting the `gridColumn` to 3, it will be placed on
   * the 3rd column.
   */
  gridColumn?: number;

  /**
   * Sets the gaps (gutters) between rows and columns. The gap is applied to all layouts.
   */
  gap?: string | number;

  /**
   * Specifies the stack order of a component. This is useful in combination with sticky layouts,
   * where the stacking order cannot be controlled by static css rules.
   *
   * Defaults to `1` in sticky layouts.
   */
  zIndex?: number;

  /**
   * Very useful for stick layouts that need to allow for scrollable overflow, typically
   * in combination with sticky layout. The side navigation aside the page content is a
   * good example where this is needed, since the aside navigation is often setup to stick
   * to the top so that it won't scroll away.
   *
   * The overflow cannot be hardcoded for sticky layouts, since there are sticky layouts that
   * require explicit overflows (eg. typeahead search inside a sticky header)
   */
  overflow?: string;

  /**
   * The width is applied as a CSS variable (`--width`) and can be used by the items` component
   * implementation. The width is _not_ applied to grid based layouts, since the layout of those
   * items are driven by the columns and rows. For the flex and column based layouts however, the width is applied
   * to overrule the calculated size.
   *
   * An image component is a good example where the `--width` could be used.
   */
  width?: string;

  /**
   * The height is applied as a CSS variable (`--height`) and can be used by the items` component
   * implementation. The height is _not_ applied to the layout, since the layout is driven by a
   * grid system.
   *
   * An image component is a good example where the `--height` could be used.
   */
  height?: string;

  /**
   * Allows to set the padding of the item.
   */
  padding?: string;

  /**
   * Allows to set the margin of the item.
   */
  margin?: string;

  /**
   * The top is typically used in combination with a sticky layout, to configure the position where the
   * layout should stick.
   */
  top?: string;

  /**
   * Allows to specify the rotation of the item.
   */
  rotate?: number;

  /**
   * Specifies the background of the item. The background can be used to set a color or even
   * a background image.
   */
  background?: string;

  /**
   * Sets the fill color of SVG resources. SVG resources can use specific colors which can be overridden
   * with a custom color. For example, a native logo color, say coca-cola red, can be overridden with
   * a neutral color to make the logo less dominant on the page.
   */
  fill?: string;

  /**
   * Sets an element's border, using a width, style and color (e.g. `1px solid red`)
   */
  border?: string;

  /**
   * Rounds the corners of an element's outer border edge.
   */
  radius?: string | number;

  ratio?: string;

  /**
   * Transforms the component using this scale.
   */
  scale?: number;

  /**
   * Specifies the typography tag, which is one of the available heading tags.
   * The typography is applied to the component and all it's sub components, including those components
   * with a shadow dom, since typography is inherited in shadow dom.
   */
  typography?: HeadingTag | string;

  style?: string;
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
