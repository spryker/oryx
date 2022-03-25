import { Provider } from '@spryker-oryx/injector';
import { HttpService } from './http/http.service';
import { CoreServices } from './services';

export const HTTP_PROVIDERS: Provider[] = [
  {
    provide: CoreServices.Http,
    useClass: HttpService,
  },
];
