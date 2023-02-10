import { componentDef } from '@spryker-oryx/core';
import { BannerOptions } from './banner.model';

declare global {
  interface FeatureOptions {
    'oryx-banner'?: BannerOptions;
  }
}

export const bannerComponent = componentDef({
  name: 'oryx-banner',
  impl: () => import('./banner.component').then((m) => m.BannerComponent),
  schema: () => import('./banner.schema').then((m) => m.bannerComponentSchema),
});
