import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['site-notification-center']: {
      tag: 'site-notification-center',
    },
  },
};
