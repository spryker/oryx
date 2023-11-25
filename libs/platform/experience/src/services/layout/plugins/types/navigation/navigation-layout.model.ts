import { LayoutPlugin } from '../../layout.plugin';

export const NavigationLayoutPluginToken = `${LayoutPlugin}navigation`;

declare global {
  export interface Layouts {
    navigation: undefined;
    navigationType?: 'flyout' | 'dropdown';
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface LayoutProperty extends NavigationLayoutProperties {}
}

export interface NavigationLayoutProperties {
  navigationType?: 'flyout' | 'dropdown';
}
