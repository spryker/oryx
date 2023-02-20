import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['oryx-cart-add']: {},
    ['cart-entries']: {},
    ['cart-totals']: {},
    ['oryx-cart-summary']: {},
  },
};
