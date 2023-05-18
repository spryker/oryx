import { ResourceGraphic } from '@spryker-oryx/experience';
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
  applePay: { source: () => import('./apple-pay').then((m) => m.resource) },
  googlePay: { source: () => import('./google-pay').then((m) => m.resource) },
  appleStore: { source: () => import('./apple-store').then((m) => m.resource) },
  dhl: { source: () => import('./dhl').then((m) => m.resource) },
  dhlExpress: { source: () => import('./dhl-express').then((m) => m.resource) },
  google: { source: () => import('./google').then((m) => m.resource) },
  mastercard: { source: () => import('./mastercard').then((m) => m.resource) },
  paypal: { source: () => import('./paypal').then((m) => m.resource) },
  playStore: { source: () => import('./play-store').then((m) => m.resource) },
  visa: { source: () => import('./visa').then((m) => m.resource) },
  klarna: { source: () => import('./klarna').then((m) => m.resource) },
  hermes: { source: () => import('./hermes').then((m) => m.resource) },
  ...socialLogos,
};
