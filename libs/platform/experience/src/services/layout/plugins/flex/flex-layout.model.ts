import { LayoutPlugin } from '../layout.plugin';

export const FlexLayoutPluginToken = `${LayoutPlugin}flex`;

declare global {
  export interface PlugableLayouts {
    flex: undefined;
  }
}
