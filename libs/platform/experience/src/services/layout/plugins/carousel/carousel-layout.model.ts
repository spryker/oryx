import { LayoutPlugin } from '../layout.plugin';

export const CarouselLayoutPluginToken = `${LayoutPlugin}carousel`;

declare global {
  export interface PluggableLayouts {
    carousel: undefined;
  }
}
