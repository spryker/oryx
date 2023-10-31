import { LayoutPropertyPlugin } from '../../layout.plugin';

export const StickyLayoutPluginToken = `${LayoutPropertyPlugin}sticky`;

declare global {
  export interface LayoutProperty {
    /**
     * Indicates that the composition will stick on the screen at a certain position. The position
     * defaults to 0px from the top, but can be customised using the styling. For a footer for example
     * the top can be configured to be 100%.
     */
    sticky?: boolean;
  }

  export interface LayoutStylesProperties {
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
  }
}
