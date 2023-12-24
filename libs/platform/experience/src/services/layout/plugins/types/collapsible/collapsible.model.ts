import { LayoutPlugin } from '../../layout.plugin';

export const CollapsibleLayoutPluginToken = `${LayoutPlugin}collapsible`;

declare global {
  export interface Layouts {
    collapsible: undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface LayoutProperty extends CollapsibleLayoutProperties {}
}

export interface CollapsibleLayoutProperties {
  collapsibleOpen?: boolean;
}
