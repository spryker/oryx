import { componentDef } from '@spryker-oryx/core';

export const orderConfirmationBannerComponent = componentDef({
  name: 'oryx-order-confirmation-banner',
  impl: () =>
    import('./confirmation-banner.component').then(
      (m) => m.OrderConfirmationBannerComponent
    ),
});
