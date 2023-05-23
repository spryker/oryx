import { ResourceGraphic } from '@spryker-oryx/experience';
import { deliveryMethodsLogos } from './delivery';
import { paymentMethodsLogos } from './payment';
import { socialLogos } from './social';

export const brandGraphics: ResourceGraphic = {
  apple: { source: () => import('./apple').then((m) => m.resource) },
  dell: { source: () => import('./dell').then((m) => m.resource) },
  samsung: { source: () => import('./samsung').then((m) => m.resource) },
  sony: { source: () => import('./sony').then((m) => m.resource) },
  tomtom: { source: () => import('./tomtom').then((m) => m.resource) },
  lenovo: { source: () => import('./lenovo').then((m) => m.resource) },
  hp: { source: () => import('./hp').then((m) => m.resource) },
  asus: { source: () => import('./asus').then((m) => m.resource) },
  acer: { source: () => import('./acer').then((m) => m.resource) },
  fujitsu: { source: () => import('./fujitsu').then((m) => m.resource) },
  appleStore: { source: () => import('./apple-store').then((m) => m.resource) },
  playStore: { source: () => import('./play-store').then((m) => m.resource) },

  ...deliveryMethodsLogos,
  ...paymentMethodsLogos,
  ...socialLogos,
};
