import { componentDef } from '@spryker-oryx/utilities';

export const productOffersComponent = componentDef({
  name: 'oryx-product-offers',
  impl: () =>
    import('./offers.component').then((m) => m.ProductOffersComponent),
  schema: () =>
    import('./offers.schema').then((m) => m.merchantOfferListSchema),
});
