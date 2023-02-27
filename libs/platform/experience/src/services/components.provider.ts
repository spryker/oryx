import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from './experience-tokens';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: true,
};
