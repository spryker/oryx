import { componentDef } from '@spryker-oryx/utilities';

export const dropdownItemComponent = componentDef({
  name: 'oryx-dropdown-item',
  impl: () =>
    import('./dropdown-item.component').then((m) => m.DropdownItemComponent),
});
