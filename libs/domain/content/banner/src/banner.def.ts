import { componentDef } from '@spryker-oryx/core';
import { BannerOptions } from './banner.model';

declare global {
  interface Flags {
    'oryx-banner'?: BannerOptions;
  }
}

export const bannerComponent = componentDef({
  name: 'oryx-banner',
  impl: () => import('./banner.component').then((m) => m.BannerComponent),
});
