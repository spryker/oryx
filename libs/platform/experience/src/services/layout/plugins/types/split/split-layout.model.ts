import { LayoutPlugin } from '../../layout.plugin';

export const SplitLayoutPluginToken = `${LayoutPlugin}split`;

declare global {
  export interface Layouts {
    split: undefined;
  }
}
