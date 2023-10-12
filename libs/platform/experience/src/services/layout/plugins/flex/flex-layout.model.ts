import { LayoutPlugin } from '../layout.plugin';

export const FlexLayoutPluginToken = `${LayoutPlugin}flex`;

declare global {
  export interface PluggableLayouts {
    flex: undefined;
  }
}
