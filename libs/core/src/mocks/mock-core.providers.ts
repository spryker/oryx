import {
  AccessTokenService,
  AuthService,
  DefaultAccessTokenService,
  DefaultAuthService,
  DefaultHttpService,
  DefaultStorageService,
  HttpService,
  StorageService,
} from '../services';

export const MOCK_AUTH_PROVIDERS = [
  {
    provide: AccessTokenService,
    useClass: DefaultAccessTokenService,
  },
  {
    provide: AuthService,
    useClass: DefaultAuthService,
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
