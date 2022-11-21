import { Provider } from '@spryker-oryx/injector';
import { AccessTokenService, DefaultAccessTokenService } from './access-token';
import {
  AuthAdapter,
  AuthService,
  DefaultAuthAdapter,
  DefaultAuthService,
  tokenNormalizer,
} from './auth';
import { componentsProvider } from './components.provider';
import {
  DefaultIdentityInterceptor,
  DefaultIdentityService,
  IdentityInterceptor,
  IdentityService,
} from './identity';

export const authProviders: Provider[] = [
  componentsProvider,
  {
    provide: AccessTokenService,
    useClass: DefaultAccessTokenService,
  },
  {
    provide: AuthService,
    useClass: DefaultAuthService,
  },
  { provide: AuthAdapter, useClass: DefaultAuthAdapter },
  {
    provide: IdentityService,
    useClass: DefaultIdentityService,
  },
  {
    provide: IdentityInterceptor,
    useClass: DefaultIdentityInterceptor,
  },
  ...tokenNormalizer,
];
