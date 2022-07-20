import { inject } from '@spryker-oryx/injector';
import { catchError, map, Observable, of } from 'rxjs';
import { AccessTokenService } from './access-token.service';
import { AuthService } from './auth.service';
import { AccessToken, TokenExchangeParams } from './model';

export class DefaultAuthService implements AuthService {
  protected remember = false;

  constructor(protected accessTokenService = inject(AccessTokenService)) {}

  login(
    username: string,
    password: string,
    persist: boolean
  ): Observable<boolean> {
    const login: TokenExchangeParams = {
      username,
      password,
      persist,
    };
    this.logout();
    return this.accessTokenService.load(login).pipe(
      catchError(() => of(null)),
      map((token: AccessToken | null) => !!token)
    );
  }

  logout(): void {
    this.accessTokenService.remove();
  }

  getToken(): Observable<AccessToken | null> {
    return this.accessTokenService.get();
  }

  isAuthenticated(): Observable<boolean> {
    return this.getToken().pipe(map((token) => !!token));
  }
}
