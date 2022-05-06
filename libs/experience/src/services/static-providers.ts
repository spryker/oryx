import { Provider } from '@spryker-oryx/injector';
import { DefaultExperienceService, ExperienceService } from './experience';
import {
  ComponentsRegistryService,
  DefaultComponentsRegistryService,
} from './registry';

export const STATIC_PROVIDERS: Provider[] = [
  {
    provide: ExperienceService,
    useClass: DefaultExperienceService,
  },
  {
    provide: ComponentsRegistryService,
    useClass: DefaultComponentsRegistryService,
  },
];
