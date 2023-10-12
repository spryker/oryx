import { LayoutPlugin } from '../layout.plugin';

export const SplitAsideLayoutPluginToken = `${LayoutPlugin}split`;

declare global {
  export interface PlugableLayouts {
    'split-aside': undefined;
  }
}
