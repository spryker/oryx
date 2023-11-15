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
   * @since 1.3, previously wrap was enabled by default and there was
   * no ability to disable it.
   */
  wrap?: boolean;
}
