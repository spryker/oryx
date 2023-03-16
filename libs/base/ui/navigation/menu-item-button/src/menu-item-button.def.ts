import { componentDef } from '@spryker-oryx/core';

export const menuItemButtonComponent = componentDef({
  name: 'oryx-menu-item-button',
  impl: () => import('./menu-item-button.component').then((m) => m.MenuItemButtonComponent),
});
