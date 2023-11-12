import { LayoutPlugin } from '../../layout.plugin';

export const FlexLayoutPluginToken = `${LayoutPlugin}flex`;

declare global {
  export interface Layouts {
    flex: undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface LayoutProperty extends FlexLayoutProperties {}
}

export interface FlexLayoutProperties {
  /**
   * If true, items will wrap to the next line.
   *
   * @since 1.3, 1.2 had hardcoded wrap for all flex items.
   */
  wrap?: boolean;
}
