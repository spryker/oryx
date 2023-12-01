import { LayoutPlugin } from '../../layout.plugin';

export const ListLayoutPluginToken = `${LayoutPlugin}list`;

declare global {
  export interface Layouts {
    list: undefined;
  }
}
