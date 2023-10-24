import { componentDef } from '@spryker-oryx/utilities';

export const merchantLogoComponent = componentDef({
  name: 'oryx-merchant-logo',
  impl: () => import('./logo.component').then((m) => m.MerchantLogoComponent),
});
