import { LayoutPlugin } from '../../layout.plugin';

export const CollapsibleLayoutPluginToken = `${LayoutPlugin}collapsible`;

declare global {
  export interface Layouts {
    collapsible: undefined;
  }

  export interface LayoutProperty {
    collapsibleOpen?: boolean;
    /**
     * The sync key to use for storing the open state. If set, the open state is stored
     * in session storage and restored when the component is used in the same session.
     */
    collapsibleStateKey?: string;
  }
}
