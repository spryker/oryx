import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['address-list']: {
      tag: 'oryx-address-list',
    },
    ['oryx-user-summary']: {
      tag: 'oryx-user-summary',
    },
  },
};
