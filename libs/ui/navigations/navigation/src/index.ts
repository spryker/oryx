import { componentDef } from '@spryker-oryx/core';

export * from './navigation-collapse.controller';
export * from './navigation.component';
export * from './navigation.styles';

export const navigationComponent = componentDef({
  name: 'oryx-navigation',
  impl: () =>
    import('./navigation.component').then((m) => m.NavigationComponent),
});
