import { LayoutPlugin } from '../layout.plugin';

export const ColumnLayoutPluginToken = `${LayoutPlugin}column`;

declare global {
  export interface Layouts {
    column: undefined;
  }
}
