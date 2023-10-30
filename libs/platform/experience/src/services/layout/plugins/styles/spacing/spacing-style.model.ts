export {};

declare global {
  export interface LayoutStylesProperties {
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

    ratio?: string;
  }
}
