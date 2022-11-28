import { RouterService } from '@spryker-oryx/experience';
import { Provider } from '@spryker-oryx/injector';
import { DefaultRouterService } from './router/default-router.service';

export const applicationProviders: Provider[] = [
  {
    provide: RouterService,
    useClass: DefaultRouterService,
  },
];
