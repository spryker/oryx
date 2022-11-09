import { componentDef } from '@spryker-oryx/core';

export const chipComponent = componentDef({
  name: 'oryx-chip',
  impl: () => import('./chip.component').then((m) => m.ChipComponent),
  themes: [
    {
      name: 'backoffice',
      styles: () =>
        import('./styles/themes/backoffice.styles').then(
          (m) => m.chipBackofficeUI
        ),
    },
    {
      name: 'storefront',
      styles: () =>
        import('./styles/themes/storefront.styles').then(
          (m) => m.chipStorefrontUI
        ),
    },
  ],
});
