import { LayoutPlugin } from '../../layout.plugin';

export const CollapsibleLayoutPluginToken = `${LayoutPlugin}collapsible`;

declare global {
  export interface Layouts {
    collapsible: undefined;
  }
}
