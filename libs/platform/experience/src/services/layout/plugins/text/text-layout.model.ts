import { LayoutPlugin } from '../layout.plugin';

export const TextLayoutPluginToken = `${LayoutPlugin}text`;

declare global {
  export interface PlugableLayouts {
    text: undefined;
  }
}
