import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['checkout-link']: {},
    ['checkout-guest']: {},
    ['checkout-auth']: {},
    ['checkout-shipment']: {},
    ['checkout-payment']: {},
    ['checkout-place-order']: {},
    ['oryx-checkout-composition']: {},
  },
};
