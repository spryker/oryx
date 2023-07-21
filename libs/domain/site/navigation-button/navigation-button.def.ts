import { componentDef } from '@spryker-oryx/utilities';

export const navigationButtonComponent = componentDef({
  name: 'oryx-site-navigation-button',
  impl: () =>
    import('./navigation-button.component').then(
      (m) => m.NavigationButtonComponent
    ),
  schema: import('./navigation-button.schema').then(
    (m) => m.siteNavigationButtonSchema
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
