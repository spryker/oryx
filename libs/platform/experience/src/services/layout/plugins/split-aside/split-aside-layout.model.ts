import { LayoutPlugin } from '../layout.plugin';

export const SplitAsideLayoutPluginToken = `${LayoutPlugin}split`;

declare global {
  export interface PluggableLayouts {
    'split-aside': undefined;
  }
}
