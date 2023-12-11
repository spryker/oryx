import { componentDef } from '@spryker-oryx/utilities';

export const merchantOfferListItemComponent = componentDef({
  name: 'oryx-merchant-offer-list-item',
  impl: () =>
    import('./offer-list-item.component').then(
      (m) => m.MerchantOfferListItemComponent
    ),
  schema: () =>
    import('./offer-list-item.schema').then(
      (m) => m.merchantOfferListItemSchema
    ),
});
