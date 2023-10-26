import { LayoutPlugin } from '../layout.plugin';

export const GridLayoutPluginToken = `${LayoutPlugin}grid`;

declare global {
  export interface Layouts {
    grid: undefined;
  }
}
