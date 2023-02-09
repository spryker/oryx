import { componentDef } from '@spryker-oryx/core';

export const navigationItemComponent = componentDef({
  name: 'oryx-navigation-item',
  impl: () =>
    import('./navigation-item.component').then(
      (m) => m.NavigationItemComponent
    ),
});
