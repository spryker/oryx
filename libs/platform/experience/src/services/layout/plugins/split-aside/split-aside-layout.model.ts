import { LayoutPlugin } from '../layout.plugin';

export const SplitAsideLayoutPluginToken = `${LayoutPlugin}split-aside`;

declare global {
  export interface PluggableLayouts {
    'split-aside': undefined;
  }
}
