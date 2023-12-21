import { componentDef } from '@spryker-oryx/utilities';

export const merchantOfferComponent = componentDef({
  name: 'oryx-merchant-offer',
  impl: () => import('./offer.component').then((m) => m.MerchantOfferComponent),
  schema: () => import('./offer.schema').then((m) => m.merchantOfferSchema),
});
