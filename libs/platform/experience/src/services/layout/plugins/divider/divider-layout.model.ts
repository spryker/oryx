import { LayoutPlugin } from '../layout.plugin';

export const DividerLayoutPluginToken = `${LayoutPlugin}divider`;

declare global {
  export interface PlugableLayoutsStyles {
    divider?: boolean;
  }
}
