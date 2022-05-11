import { HttpService, SSRAwaiterService } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import { ServerHttpService } from './http/server-http.service';
import { DefaultSSRAwaiterService } from './ssr-awaiter';

export const HTTP_SERVER_PROVIDERS: Provider[] = [
  {
    provide: HttpService,
    useClass: ServerHttpService,
  },
];

export const CORE_SERVER_PROVIDERS: Provider[] = [
  ...HTTP_SERVER_PROVIDERS,
  {
    provide: SSRAwaiterService,
    useClass: DefaultSSRAwaiterService,
  },
];
