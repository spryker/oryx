import { Provider } from '@spryker-oryx/injector';
import {
  AccessTokenService,
  AuthAdapter,
  AuthService,
  DefaultAccessTokenService,
  DefaultAuthAdapter,
  DefaultAuthService,
  TokenNormalizers,
  tokenNormalizers,
} from './auth';
import { DefaultIdentityService } from './auth/default-identity.service';
import { IdentityService } from './auth/identity.service';
import { ContextService, DefaultContextService } from './context';
import { DefaultHttpService, HttpService } from './http';
import { DefaultStorageService, StorageService } from './storage';
import {
  DefaultJsonAPITransformerService,
  DefaultTransformerService,
  JsonAPITransformerService,
  TransformerService,
} from './transformer';

export const coreProviders: Provider[] = [
  {
    provide: HttpService,
    useClass: DefaultHttpService,
  },
  {
    provide: ContextService,
    useClass: DefaultContextService,
  },
  {
    provide: AccessTokenService,
    useClass: DefaultAccessTokenService,
  },
  {
    provide: AuthService,
    useClass: DefaultAuthService,
  },
  { provide: AuthAdapter, useClass: DefaultAuthAdapter },
  { provide: TokenNormalizers, useValue: tokenNormalizers },
  {
    provide: IdentityService,
    useClass: DefaultIdentityService,
  },
  {
    provide: JsonAPITransformerService,
    useClass: DefaultJsonAPITransformerService,
  },
  {
    provide: TransformerService,
    useClass: DefaultTransformerService,
  },
  {
    provide: StorageService,
    useClass: DefaultStorageService,
  },
];
