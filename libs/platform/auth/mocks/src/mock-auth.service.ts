import {
  AuthIdentity,
  AuthService,
  AuthTokenData,
  AuthTokenService,
  IdentityService,
} from '@spryker-oryx/auth';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

export class MockAuthService
  implements AuthService, AuthTokenService, IdentityService
{
  protected isAuthenticated$ = new BehaviorSubject<boolean>(false);

  login(): Observable<void> {
    return of(undefined);
  }

  logout(): Observable<void> {
    return of(undefined);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  getToken(): Observable<AuthTokenData> {
    return this.isAuthenticated$.pipe(
      map((isAuthenticated) =>
        isAuthenticated
          ? { token: 'mock-token', type: 'access_token' }
          : { token: 'anon-user-id', type: 'anon' }
      )
    );
  }

  get(): Observable<AuthIdentity> {
    return this.isAuthenticated$.pipe(
      map((isAuthenticated) => ({
        isAuthenticated,
        userId: isAuthenticated ? 'user-id' : 'anon-user-id',
      }))
    );
  }

  setAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticated$.next(isAuthenticated);
  }
}
