import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['oryx-content-link']: {},
    ['oryx-content-banner']: {},
    ['oryx-content-video']: {},
  },
};
