import { RouterService } from '@spryker-oryx/experience';
import { Provider } from '@spryker-oryx/injector';
import { MockRouterService } from './mock-router.service';

export const mockExperienceProviders: Provider[] = [
  {
    provide: RouterService,
    useClass: MockRouterService,
  },
];
