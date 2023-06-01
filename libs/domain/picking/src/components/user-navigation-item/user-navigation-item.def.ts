import { componentDef } from '@spryker-oryx/core';

export const userNavigationItemComponent = componentDef({
  name: 'oryx-picking-user-navigation-item',
  impl: () =>
    import('./user-navigation-item.component').then(
      (m) => m.UserNavigationItemComponent
    ),
});
