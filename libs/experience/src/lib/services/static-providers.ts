import { Provider } from '@spryker-oryx/injector';
import { ExperienceService } from './experience';
import { ComponentsRegistryService } from './registry';
import { Services } from './services';

export const STATIC_PROVIDERS: Provider[] = [
  {
    provide: Services.Experience,
    useClass: ExperienceService,
  },
  {
    provide: Services.ComponentsRegistry,
    useClass: ComponentsRegistryService,
  },
];
