import { componentDef } from '@spryker-oryx/utilities';

export const pageNavigationComponent = componentDef({
  name: 'oryx-page-navigation',
  impl: () =>
    import('./page-navigation.component').then(
      (m) => m.PageNavigationComponent
    ),
});
