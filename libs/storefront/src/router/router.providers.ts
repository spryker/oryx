import { RouterService } from '@spryker-oryx/experience';
import { Provider } from '@spryker-oryx/injector';
import { StorefrontRouterService } from './router.service';

export const routerProviders: Provider[] = [
  {
    provide: RouterService,
    useClass: StorefrontRouterService,
  },
];
