import { ResourceGraphic } from '@spryker-oryx/experience';

export const paymentMethodsLogos: ResourceGraphic = {
  applePay: { source: () => import('./apple-pay').then((m) => m.resource) },
  googlePay: { source: () => import('./google-pay').then((m) => m.resource) },
  mastercard: { source: () => import('./mastercard').then((m) => m.resource) },
  paypal: { source: () => import('./paypal').then((m) => m.resource) },
  visa: { source: () => import('./visa').then((m) => m.resource) },
  klarna: { source: () => import('./klarna').then((m) => m.resource) },
};
