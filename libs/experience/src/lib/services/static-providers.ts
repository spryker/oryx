import { Provider } from '@spryker-fes/injector';
import { ExperienceService } from './experience';
import { Services } from './services';

export const STATIC_PROVIDERS: Provider[] = [
  {
    provide: Services.Experience,
    useClass: ExperienceService,
  },
];
