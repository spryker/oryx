import { componentDef } from '@spryker-oryx/core';

export const navigationButtonComponent = componentDef({
  name: 'oryx-site-navigation-button',
  impl: () =>
    import('./navigation-button.component').then(
      (m) => m.NavigationButtonComponent
    ),
  stylesheets: [
    {
      rules: () =>
        import('./navigation-button.styles').then(
          (m) => m.navigationButtonScreenStyles
        ),
    },
  ],
});
