import {
  AuthService,
  AuthTokenService,
  IdentityService,
} from '@spryker-oryx/auth';
import { Provider, inject } from '@spryker-oryx/di';
import { MockAuthService } from './mock-auth.service';

export const mockAuthProviders: Provider[] = [
  { provide: MockAuthService, useClass: MockAuthService },
  { provide: AuthService, useFactory: () => inject(MockAuthService) },
  {
    provide: AuthTokenService,
    useFactory: () => inject(MockAuthService),
  },
  { provide: IdentityService, useFactory: () => inject(MockAuthService) },
];
