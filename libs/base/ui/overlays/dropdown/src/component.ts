import { componentDef } from '@spryker-oryx/core';

export const dropdownComponent = componentDef({
  name: 'oryx-dropdown',
  impl: () => import('./dropdown.component').then((m) => m.DropdownComponent),
});
