import {
  ContextService,
  HttpService,
  JsonAPITransformerService,
  SSRAwaiterService,
  StorageService,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ServerContextService } from './context';
import { ServerHttpService } from './http';
import { ServerJsonApiTransformerService } from './json-api';
import { DefaultSSRAwaiterService } from './ssr-awaiter';
import { ServerStorageService } from './storage';

export const coreServerProviders: Provider[] = [
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
  {
    provide: JsonAPITransformerService,
    useClass: ServerJsonApiTransformerService,
  },
];
