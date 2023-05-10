import { ResourceGraphic } from '@spryker-oryx/experience';

export { fulfillmentResourceGraphics } from './fulfillment';

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
  'order-confirmation-success': {
    source: () => import('./order-confirmation-success').then((m) => m.success),
  },
};
