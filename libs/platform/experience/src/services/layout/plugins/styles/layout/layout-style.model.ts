import { LayoutAlign } from '../../../layout.model';

export {};

declare global {
  export interface LayoutStylesProperties {
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
  }
}
