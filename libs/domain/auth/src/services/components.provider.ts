import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['auth-login']: {
      tag: 'auth-login',
    },
    ['auth-logout']: {
      tag: 'auth-logout',
    },
  },
};
