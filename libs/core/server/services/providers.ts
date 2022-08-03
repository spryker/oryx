import {
  ContextService,
  HttpService,
  SSRAwaiterService,
  StorageService,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import { ServerContextService } from './context';
import { ServerHttpService } from './http';
import { DefaultSSRAwaiterService } from './ssr-awaiter';
import { ServerStorageService } from './storage';

export const CORE_SERVER_PROVIDERS: Provider[] = [
  {
    provide: HttpService,
    useClass: ServerHttpService,
  },
  {
    provide: SSRAwaiterService,
    useClass: DefaultSSRAwaiterService,
  },
  {
    provide: ContextService,
    useClass: ServerContextService,
  },
  {
    provide: StorageService,
    useClass: ServerStorageService,
  },
];
