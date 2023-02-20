import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['oryx-order-confirmation-banner']: {},
    ['oryx-order-summary']: {},
    ['oryx-order-entries']: {},
    ['oryx-order-totals']: {},
  },
};
