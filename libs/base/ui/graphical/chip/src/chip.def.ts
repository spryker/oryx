import { componentDef } from '@spryker-oryx/core';

export const chipComponent = componentDef({
  name: 'oryx-chip',
  impl: () => import('./chip.component').then((m) => m.ChipComponent),
  stylesheets: [
    {
      theme: 'backoffice',
      rules: () =>
        import('./styles/themes/backoffice.styles').then(
          (m) => m.chipBackofficeUI
        ),
    },
    {
      theme: 'storefront',
      rules: () =>
        import('./styles/themes/storefront.styles').then(
          (m) => m.chipStorefrontUI
        ),
    },
  ],
});
