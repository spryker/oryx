import { LayoutPlugin } from '../layout.plugin';

export const ColumnLayoutPluginToken = `${LayoutPlugin}column`;

declare global {
  export interface PluggableLayouts {
    column: undefined;
  }
}
