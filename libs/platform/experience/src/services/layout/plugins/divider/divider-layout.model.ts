import { LayoutPlugin } from '../layout.plugin';

export const DividerLayoutPluginToken = `${LayoutPlugin}divider`;

declare global {
  export interface PluggableLayoutProperties {
    divider?: boolean;
  }
}
