import { componentDef } from '@spryker-oryx/core';

export * from './page-navigation-item.component';
export * from './page-navigation-item.styles';

export const pageNavigationItemComponent = componentDef({
  name: 'oryx-page-navigation-item',
  impl: () =>
    import('./page-navigation-item.component').then(
      (m) => m.PageNavigationItemComponent
    ),
});
