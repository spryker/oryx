import { componentDef } from '@spryker-oryx/core';

export const menuItemComponent = componentDef({
  name: 'oryx-menu-item',
  impl: () => import('./menu-item.component').then((m) => m.MenuItemComponent),
});
