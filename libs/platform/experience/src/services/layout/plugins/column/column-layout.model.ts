import { LayoutPlugin } from '../layout.plugin';

export const ColumnLayoutPluginToken = `${LayoutPlugin}column`;

declare global {
  export interface PlugableLayouts {
    column: undefined;
  }
}
