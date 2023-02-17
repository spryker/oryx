import {
  CompositionLayout,
  CompositionLayoutOrientation,
} from '../../src/models';

/**
 * The Layout attributes are used to apply layout to a container element. The container
 * element can apply a specific layout to its child elements, such as a grid, carousel,
 * (two)column, list, etc.
 *
 * Containers can be nested, so that nested layouts can be created. A grid item for example
 * can contain a carousel. This plays nicely together with other layout options that can be
 * applied to the layouts items, such as spanning of a column, setting the gap, padding or
 * margin. All these options are carefully taken into consideration in the layout, so that
 * they won't break the natural layout flow.
 */
export interface LayoutAttributes {
  /**
   * The layout attribute is the key indicator for the type of layout.
   *
   * ## Layout types
   * There are a couple of standard layouts available:
   * * `list` - the items are listed in a vertical list and support a padding (gap) in between
   *   each row
   * * `grid` - the items are spread over a grid with column and rows.
   * * carousel - the carousel uses a single grid row and distributes the items over an infinite
   * number of columns
   * * `column` -  the column layout is driven by the grid system (using 12, 8 or 4 columns) and
   * distributes the items.
   * * `two-columns` - the two column layout is based on the column layout, but has a hardcoded
   * configuration for the odd and even items. The odd items will use the _span_ and _gap_
   * design tokens. For large screens, 7 columns are spanned for the odd items, and the even items
   * take the max available space (`maxWidth`).
   * * `flex` - the flex layout distributes the items without using the grid system. Each item can
   * take the space that is required. The `maxWidth` property can be used on an item to take the
   * maximum available space.
   *
   * The columns that are used inside the grid and carousel are based on the column design
   * token and the _layout factor_ design token. This will then differ by screen size:
   * - large screen: 4 columns (cols = `12`, factor = `3`)
   * - medium screen: 2 columns (cols = `8`, factor = `4`)
   * - small screen: 1 column (cols = `4`, factor = `4`)
   *
   * ## Nested layouts
   * All layout support nested layouts. Items can span over multiple columns. The combination of
   * the span and nested layout will allow for very dynamic layouts.
   *
   * Additionally, the items can be set up to move inside the grid, e.g. the first item can move to
   * the 2nd row and 3rd column.
   *
   * ## Styling
   * The layout as well as the items can be set up with custom margin, padding and gap sizes. The
   * layout will remain proper.
   */
  layout?: CompositionLayout;

  orientation?: CompositionLayoutOrientation;

  /**
   * Indicates whether the layout is rendered inside a container. A container represents the
   * maximum width of a centered global layout, so that the layout will look great on wider screens.
   *
   * The container size is configurable by a design token.
   *
   * If the container is combined with the `maxWidth` attribute, the full width of the page can
   * be styled with a background. The content of the _container_ however will still be restricted
   * to the container size.
   */
  container?: boolean;

  /**
   * The max width can be used to take the maximum available horizontal space. This is useful in two cases:
   * * when a layout is container-ed, the full width can be styled (eg background color)
   * * when an item in a flex or column layout requires to use the available space
   */
  maxWidth?: boolean;

  /**
   * Indicates that the composition will stick on the screen at a certain position. The position
   * defaults to 0px from the top, but can be customised using the styling. For a footer for example
   * the top can be configured to be 100%.
   */
  sticky?: boolean;
}
