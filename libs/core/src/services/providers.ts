import { Provider } from '@spryker-oryx/injector';
import { DefaultContextService } from './context';
import { DefaultHttpService, HttpService } from './http';
import { CoreServices } from './services';

export const HTTP_PROVIDERS: Provider[] = [
  {
    provide: HttpService,
    useClass: DefaultHttpService,
  },
];

export const CORE_PROVIDERS: Provider[] = [
  ...HTTP_PROVIDERS,
  {
    provide: CoreServices.Context,
    useClass: DefaultContextService,
  },
];
