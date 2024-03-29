declare global {
  export interface LayoutStylesProperties {
    /**
     * Specifies the background of the item. The background can be used to set a color or even
     * a background image.
     */
    background?: string;

    /**
     * Sets the overflow behavior of an element's content. If an element's content is larger than
     * the element itself, the overflow property specifies whether to clip the content or to add
     * scrollbars to display the content.
     */
    overflow?: string;

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

    /**
     * Sets the shadow elevation of the element. The shadow elevation can be used to create a
     * 3D effect. The elevation sets the 3D depth of the element.
     */
    shadow?: ShadowElevation;

    zIndex?: number;
  }
}

export const enum ShadowElevation {
  Flat = 'flat',
  Raised = 'raised',
  Floating = 'floating',
  Hovering = 'hovering',
}
