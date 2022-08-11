import { componentDef } from '@spryker-oryx/core';

export * from './banner.component';
export * from './banner.model';
export * from './banner.styles';

export const bannerComponent = componentDef({
  name: 'oryx-banner',
  impl: () => import('./banner.component').then((m) => m.BannerComponent),
});
