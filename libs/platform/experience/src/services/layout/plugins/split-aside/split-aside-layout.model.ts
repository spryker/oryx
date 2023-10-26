import { LayoutPlugin } from '../layout.plugin';

export const SplitAsideLayoutPluginToken = `${LayoutPlugin}split-aside`;

declare global {
  export interface Layouts {
    'split-aside': undefined;
  }
}
