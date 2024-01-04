import { LayoutPlugin } from '../../layout.plugin';

export const CollapsibleLayoutPluginToken = `${LayoutPlugin}collapsible`;

declare global {
  export interface Layouts {
    collapsible: undefined;
  }

  export interface LayoutProperty {
    collapsibleOpen?: boolean;
    /**
     * The sync key to use for this collapsible. If set, the collapsible open state
     * will be stored in the session storage and restored when the component is used
     * during the same session.
     */
    collapsibleSyncKey?: string;
  }
}
