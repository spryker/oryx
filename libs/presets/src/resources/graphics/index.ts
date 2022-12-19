import { ResourceGraphic } from '@spryker-oryx/core';

export const resourceGraphics: ResourceGraphic = {
  logo: {
    source: () => import('./logo').then((m) => m.logo),
  },
  'logo-wordmark': {
    source: () => import('./logo').then((m) => m.logoWordmark),
  },
  'logo-symbol': {
    source: () => import('./logo').then((m) => m.logoSymbol),
  },
};
