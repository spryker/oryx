import { Provider } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/experience';
import { DefaultRouterService } from './router/default-router.service';

export const applicationProviders: Provider[] = [
  {
    provide: RouterService,
    useClass: DefaultRouterService,
  },
];
