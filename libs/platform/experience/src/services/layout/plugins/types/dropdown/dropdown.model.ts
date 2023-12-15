import { LayoutPlugin } from '../../layout.plugin';

export const DropdownLayoutPluginToken = `${LayoutPlugin}dropdown`;

declare global {
  export interface Layouts {
    dropdown?: boolean;
  }

  export interface LayoutProperty {
    dropdownTrigger?: string;
  }
}
