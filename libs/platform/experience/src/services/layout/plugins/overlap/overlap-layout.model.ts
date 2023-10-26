import { LayoutPropertyPlugin } from '../layout.plugin';

export const OverlapLayoutPluginToken = `${LayoutPropertyPlugin}overlap`;

declare global {
  export interface LayoutsProperty {
    /**
     * Overlapping elements are rendered in the same grid row/column.
     */
    overlap?: boolean;
  }
}
