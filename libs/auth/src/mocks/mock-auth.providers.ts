import {
  AccessTokenService,
  AuthAdapter,
  AuthService,
  DefaultAccessTokenService,
  DefaultAuthAdapter,
  DefaultAuthService,
} from '../services';

class MockAuthAdapter implements Partial<DefaultAuthAdapter> {}

export const mockAuthProviders = [
  {
    provide: AuthService,
    useClass: DefaultAuthService,
  },
  {
    provide: AccessTokenService,
    useClass: DefaultAccessTokenService,
  },
  { provide: AuthAdapter, useClass: MockAuthAdapter },
];
