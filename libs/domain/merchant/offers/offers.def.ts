import { componentDef } from '@spryker-oryx/utilities';

export const productOffersComponent = componentDef({
  name: 'oryx-merchant-offers',
  impl: () =>
    import('./offers.component').then((m) => m.MerchantOffersComponent),
  schema: () => import('./offers.schema').then((m) => m.merchantOffersSchema),
});
