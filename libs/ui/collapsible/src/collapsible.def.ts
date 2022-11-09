import { componentDef } from '@spryker-oryx/core';

export const collapsibleComponent = componentDef({
  name: 'oryx-collapsible',
  impl: () =>
    import('./collapsible.component').then((m) => m.CollapsibleComponent),
  themes: [
    {
      name: 'backoffice',
      styles: () =>
        import('./styles/themes/backoffice.styles').then(
          (m) => m.collapsibleBackofficeUI
        ),
    },
    {
      name: 'storefront',
      styles: () =>
        import('./styles/themes/storefront.styles').then(
          (m) => m.collapsibleStorefrontUI
        ),
    },
  ],
});
