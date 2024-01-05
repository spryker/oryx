import { Position } from '@spryker-oryx/ui';
import { LayoutPlugin } from '../../layout.plugin';

export const DropdownLayoutPluginToken = `${LayoutPlugin}dropdown`;

declare global {
  export interface Layouts {
    dropdown: undefined;
  }

  export interface LayoutProperty {
    /**
     * Horizontal position of the dropdown.
     */
    dropdownPosition?: Position;
  }
}
