import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['checkout-link']: {
      tag: 'checkout-link',
    },
    ['checkout-guest']: {
      tag: 'checkout-guest',
    },
    ['checkout-auth']: {
      tag: 'checkout-auth',
    },
    ['checkout-shipment']: {
      tag: 'checkout-shipment',
    },
    ['checkout-payment']: {
      tag: 'checkout-payment',
    },
    ['checkout-place-order']: {
      tag: 'checkout-place-order',
    },
    ['oryx-checkout-composition']: {
      tag: 'oryx-checkout-composition',
    },
  },
};
