import { inject } from '@spryker-oryx/injector';
import { map, Observable } from 'rxjs';
import { AccessTokenService, AuthService } from '../services';

export class MockAuthService implements Partial<AuthService> {
  constructor(protected accessToken = inject(AccessTokenService)) {}

  isAuthenticated(): Observable<boolean> {
    return this.accessToken.get().pipe(map(Boolean));
  }
}
