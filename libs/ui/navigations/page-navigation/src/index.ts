import { componentDef } from '@spryker-oryx/core';

export * from './page-navigation.component';
export * from './page-navigation.controller';
export * from './page-navigation.styles';

export const pageNavigationComponent = componentDef({
  name: 'oryx-page-navigation',
  impl: () =>
    import('./page-navigation.component').then(
      (m) => m.PageNavigationComponent
    ),
});
