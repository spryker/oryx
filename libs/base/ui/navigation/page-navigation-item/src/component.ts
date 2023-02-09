import { componentDef } from '@spryker-oryx/core';

export const pageNavigationItemComponent = componentDef({
  name: 'oryx-page-navigation-item',
  impl: () =>
    import('./page-navigation-item.component').then(
      (m) => m.PageNavigationItemComponent
    ),
});
