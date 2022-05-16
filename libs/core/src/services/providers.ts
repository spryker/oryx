import { Provider } from '@spryker-oryx/injector';
import { ContextService, DefaultContextService } from './context';
import { DefaultHttpService, HttpService } from './http';

export const CORE_PROVIDERS: Provider[] = [
  {
    provide: HttpService,
    useClass: DefaultHttpService,
  },
  {
    provide: ContextService,
    useClass: DefaultContextService,
  },
];
