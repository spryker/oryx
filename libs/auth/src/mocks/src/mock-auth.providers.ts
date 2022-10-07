import {
  AccessTokenService,
  AuthAdapter,
  AuthService,
  DefaultAccessTokenService,
  DefaultAuthAdapter,
  DefaultAuthService,
  IdentityService,
} from '@spryker-oryx/auth';
import { MockIdentityService } from './mock-identify.service';

class MockAuthAdapter implements Partial<DefaultAuthAdapter> {}

export const mockAuthProviders = [
  {
    provide: AccessTokenService,
    useClass: DefaultAccessTokenService,
  },
  {
    provide: AuthService,
    useClass: DefaultAuthService,
  },
  { provide: AuthAdapter, useValue: MockAuthAdapter },
  {
    provide: IdentityService,
    useClass: MockIdentityService,
  },
];
