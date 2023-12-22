import { componentDef } from '@spryker-oryx/utilities';

export const merchantOfferListComponent = componentDef({
  name: 'oryx-merchant-offer-list',
  impl: () =>
    import('./offer-list.component').then((m) => m.MerchantOfferListComponent),
  schema: () =>
    import('./offer-list.schema').then((m) => m.merchantOfferListSchema),
});
