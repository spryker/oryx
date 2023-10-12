import { LayoutPlugin } from '../layout.plugin';

export const OverlapLayoutPluginToken = `${LayoutPlugin}overlap`;

declare global {
  export interface PluggableLayoutProperties {
    /**
     * Overlapping elements are rendered in the same grid row/column.
     */
    overlap?: boolean;
  }
}
