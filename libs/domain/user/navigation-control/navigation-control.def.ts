import { componentDef } from '@spryker-oryx/utilities';

export const userNavigationControlComponent = componentDef({
  name: 'oryx-user-navigation-control',
  impl: () =>
    import('./navigation-control.component.js').then(
      (m) => m.UserNavigationControlComponent
    ),
});
