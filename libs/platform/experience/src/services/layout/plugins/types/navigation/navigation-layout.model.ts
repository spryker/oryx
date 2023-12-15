import { LayoutPlugin } from '../../layout.plugin';

export const NavigationLayoutPluginToken = `${LayoutPlugin}navigation`;

declare global {
  export interface Layouts {
    navigation: undefined;
  }

  export interface LayoutProperty {
    navigationType?: 'dropdown';
    dropdown?: boolean;
    dropdownTrigger?: string;
    dropdownVerticalAlign?: boolean;
    dropdownPosition?: 'start' | 'end';
  }
}
