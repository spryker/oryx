import { componentDef } from '@spryker-oryx/utilities';

export const merchantBannerComponent = componentDef({
  name: 'oryx-merchant-banner',
  impl: () =>
    import('./banner.component').then((m) => m.MerchantBannerComponent),
  schema: () => import('./banner.schema').then((m) => m.merchantBannerSchema),
});
