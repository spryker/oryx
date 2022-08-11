import { componentDef } from '@spryker-oryx/core';

export * from './dropdown.component';
export * from './dropdown.model';
export * from './styles';

export const dropdownComponent = componentDef({
  name: 'oryx-dropdown',
  impl: () => import('./dropdown.component').then((m) => m.DropdownComponent),
});
