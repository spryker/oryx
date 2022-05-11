import { Provider } from '@spryker-oryx/injector';
import { ContextService, DefaultContextService } from './context';
import { DefaultHttpService, HttpService } from './http';

export const HTTP_PROVIDERS: Provider[] = [
  {
    provide: HttpService,
    useClass: DefaultHttpService,
  },
];

export const CORE_PROVIDERS: Provider[] = [
  ...HTTP_PROVIDERS,
  {
    provide: ContextService,
    useClass: DefaultContextService,
  },
];
