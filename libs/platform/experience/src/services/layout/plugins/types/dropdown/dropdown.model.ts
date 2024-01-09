import { Position } from '@spryker-oryx/ui';
import { LayoutPlugin } from '../../layout.plugin';

export const DropdownLayoutPluginToken = `${LayoutPlugin}dropdown`;

declare global {
  export interface Layouts {
    dropdown: undefined;
  }

  export interface LayoutProperty {
    /**
     * Show the dropdown on hover instead of click.
     */
    dropdownOnHover?: boolean;

    /**
     * Horizontal position of the dropdown.
     */
    dropdownPosition?: Position;
  }
}
