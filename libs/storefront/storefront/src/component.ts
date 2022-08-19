import { componentDef } from '@spryker-oryx/core';

export const storefrontComponent = componentDef({
  name: 'storefront-component',
  impl: () =>
    import('./storefront.component').then((m) => m.StorefrontComponent),
});
