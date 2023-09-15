import { componentDef } from '@spryker-oryx/utilities';
import { DropdownItemOptions } from './dropdown-item.model';

declare global {
  interface FeatureOptions {
    'oryx-site-dropdown-item'?: DropdownItemOptions;
  }
}

export const dropdownItemComponent = componentDef({
  name: 'oryx-site-dropdown-item',
  impl: () =>
    import('./dropdown-item.component').then((m) => m.DropdownItemComponent),
});
