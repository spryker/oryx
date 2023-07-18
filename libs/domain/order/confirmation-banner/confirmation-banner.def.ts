import { componentDef } from '@spryker-oryx/utilities';

export const orderConfirmationBannerComponent = componentDef({
  name: 'oryx-order-confirmation-banner',
  impl: () =>
    import('./confirmation-banner.component').then(
      (m) => m.OrderConfirmationBannerComponent
    ),
  schema: () =>
    import('./confirmation-banner.schema').then(
      (m) => m.orderConfirmationBannerSchema
    ),
});
