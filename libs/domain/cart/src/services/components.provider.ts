import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['oryx-cart-add']: {
      tag: 'oryx-cart-add',
    },
    ['cart-entries']: {
      tag: 'cart-entries',
    },
    ['cart-totals']: {
      tag: 'cart-totals',
    },
    ['cart-summary']: {
      tag: 'oryx-cart-summary',
    },
  },
};
