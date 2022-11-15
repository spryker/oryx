import { componentDef } from '@spryker-oryx/core';

export const iconButtonComponent = componentDef({
  name: 'oryx-icon-button',
  impl: () =>
    import('./icon-button.component').then((m) => m.IconButtonComponent),
  stylesheets: [
    {
      theme: 'storefront',
      rules: () =>
        import('./styles/themes/storefront.styles').then(
          (m) => m.iconButtonStorefrontUI
        ),
    },
  ],
});
