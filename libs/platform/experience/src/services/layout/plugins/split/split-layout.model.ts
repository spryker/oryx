import { LayoutPlugin } from '../layout.plugin';

export const SplitLayoutPluginToken = `${LayoutPlugin}split`;

declare global {
  export interface PlugableLayouts {
    split: undefined;
  }
}
