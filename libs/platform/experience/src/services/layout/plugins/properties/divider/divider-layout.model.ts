import { LayoutPropertyPlugin } from '../../layout.plugin';

export const DividerLayoutPluginToken = `${LayoutPropertyPlugin}divider`;

declare global {
  export interface LayoutProperty {
    /**
     * Indicates whether a divider should be rendered. If true, the in between
     * divider will be rendered by default.
     */
    divider?: boolean;
    /**
     * Set the divider color.
     */
    dividerColor?: string;
    /**
     * Set the divider width.
     */
    dividerWidth?: string;
    /**
     * Set the divider style.
     */
    dividerStyle?: string;
    /**
     * Render a divider before the first child element.
     */
    dividerBefore?: boolean;
    /**
     * Render a divider between each child element.
     * @default true
     */
    dividerInBetween?: boolean;
    /**
     * Render a divider after the last child element.
     */
    dividerAfter?: boolean;
  }
}
