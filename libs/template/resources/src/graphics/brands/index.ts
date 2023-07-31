import { ResourceGraphic } from '@spryker-oryx/experience';
import { deliveryMethodsLogos } from './delivery';
import { paymentMethodsLogos } from './payment';
import { socialLogos } from './social';

export const brandGraphics: ResourceGraphic = {
  Apple: { source: () => import('./apple').then((m) => m.resource) },
  DELL: { source: () => import('./dell').then((m) => m.resource) },
  Samsung: { source: () => import('./samsung').then((m) => m.resource) },
  Sony: { source: () => import('./sony').then((m) => m.resource) },
  TomTom: { source: () => import('./tomtom').then((m) => m.resource) },
  Lenovo: { source: () => import('./lenovo').then((m) => m.resource) },
  HP: { source: () => import('./hp').then((m) => m.resource) },
  Asus: { source: () => import('./asus').then((m) => m.resource) },
  Acer: { source: () => import('./acer').then((m) => m.resource) },
  Fujitsu: { source: () => import('./fujitsu').then((m) => m.resource) },
  appleStore: { source: () => import('./apple-store').then((m) => m.resource) },
  playStore: { source: () => import('./play-store').then((m) => m.resource) },

  ...deliveryMethodsLogos,
  ...paymentMethodsLogos,
  ...socialLogos,
};
