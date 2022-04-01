import { CoreServices } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import { HttpServerService } from './http/http.service';
import { SSRAwaiterService } from './ssr-awaiter';

export const HTTP_SERVER_PROVIDERS: Provider[] = [
  {
    provide: CoreServices.Http,
    useClass: HttpServerService,
  },
];

export const CORE_SERVER_PROVIDERS: Provider[] = [
  ...HTTP_SERVER_PROVIDERS,
  {
    provide: CoreServices.SSRAwaiter,
    useClass: SSRAwaiterService,
  },
];
