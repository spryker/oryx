import { LayoutPlugin } from '../layout.plugin';

export const SplitMainLayoutPluginToken = `${LayoutPlugin}split`;

declare global {
  export interface PlugableLayouts {
    'split-main': undefined;
  }
}
