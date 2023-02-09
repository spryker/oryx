import { componentDef } from '@spryker-oryx/core';

export const navigationComponent = componentDef({
  name: 'oryx-navigation',
  impl: () =>
    import('./navigation.component').then((m) => m.NavigationComponent),
});
