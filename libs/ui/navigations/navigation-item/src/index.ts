import { componentDef } from '@spryker-oryx/core';

export * from './navigation-item.component';
export * from './navigation-item.styles';

export const navigationItemComponent = componentDef({
  name: 'oryx-navigation-item',
  impl: () =>
    import('./navigation-item.component').then(
      (m) => m.NavigationItemComponent
    ),
});
