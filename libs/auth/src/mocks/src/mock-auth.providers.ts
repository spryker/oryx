import {
  AuthAdapter,
  DefaultAuthAdapter,
  IdentityService,
} from '@spryker-oryx/auth';
import { MockIdentityService } from './mock-identify.service';

class MockAuthAdapter implements Partial<DefaultAuthAdapter> {}

export const mockAuthProviders = [
  { provide: AuthAdapter, useValue: MockAuthAdapter },
  {
    provide: IdentityService,
    useClass: MockIdentityService,
  },
];
