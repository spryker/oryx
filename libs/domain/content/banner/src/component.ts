import { componentDef } from '@spryker-oryx/core';

export const bannerComponent = componentDef({
  name: 'oryx-banner',
  impl: () => import('./banner.component').then((m) => m.BannerComponent),
});
