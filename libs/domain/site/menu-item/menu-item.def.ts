import { componentDef } from '@spryker-oryx/utilities';

export const menuItemComponent = componentDef({
  name: 'oryx-site-menu-item',
  impl: () => import('./menu-item.component').then((m) => m.MenuItemComponent),
});
