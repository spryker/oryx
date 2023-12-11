import { LayoutPlugin } from '../../layout.plugin';

export const NavigationLayoutPluginToken = `${LayoutPlugin}navigation`;

declare global {
  export interface Layouts {
    navigation: undefined;
    navigationType?: 'dropdown';
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface LayoutProperty extends NavigationLayoutProperties {}
}

export interface NavigationLayoutProperties {
  // we'll be able to add 'flyout', 'sidenav', etc.
  navigationType?: 'dropdown';
}
