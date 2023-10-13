import { LayoutPlugin } from '../layout.plugin';

export const SplitMainLayoutPluginToken = `${LayoutPlugin}split-main`;

declare global {
  export interface PluggableLayouts {
    'split-main': undefined;
  }
}
