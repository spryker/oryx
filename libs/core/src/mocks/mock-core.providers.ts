import {
  AccessTokenService,
  AuthService,
  DefaultAccessTokenService,
  DefaultHttpService,
  DefaultStorageService,
  HttpService,
  StorageService,
} from '../services';
import { MockAuthService } from './moct-auth-service';

export const mockAuthProviders = [
  {
    provide: AccessTokenService,
    useClass: DefaultAccessTokenService,
  },
  {
    provide: AuthService,
    useClass: MockAuthService,
  },
  {
    provide: HttpService,
    useClass: DefaultHttpService,
  },
  {
    provide: StorageService,
    useClass: DefaultStorageService,
  },
  {
    provide: 'SCOS_BASE_URL',
    useValue: '',
  },
];
