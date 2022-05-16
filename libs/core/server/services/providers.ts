import {
  ContextService,
  HttpService,
  SSRAwaiterService,
} from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import { ServerContextService } from './context';
import { ServerHttpService } from './http';
import { DefaultSSRAwaiterService } from './ssr-awaiter';
import {
  DefaultSSRStreamParserService,
  SSRStreamParserService,
} from './ssr-stream-parser';

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
    provide: SSRStreamParserService,
    useClass: DefaultSSRStreamParserService,
  },
];
