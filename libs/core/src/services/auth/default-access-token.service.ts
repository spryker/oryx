import { inject } from '@spryker-oryx/injector';
import { toMilliseconds } from '@spryker-oryx/typescript-utils';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { HttpService } from '../http/http.service';
import { StorageService } from '../storage';
import { AccessTokenService } from './access-token.service';
import { AccessToken, TokenExchangeParams } from './model';
import { canRenew, requiresRefresh } from './utils';

export class DefaultAccessTokenService implements AccessTokenService {
  protected ACCESS_TOKEN_IDENTIFIER = 'access-token';
  protected AUTH_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  constructor(
    protected http = inject(HttpService),
    protected apiUrl = inject('SCOS_BASE_URL'),
    protected storage = inject(StorageService)
  ) {}

  /**
   * @param key the logical key that is used to sync the token with local storage
   */
  get(): Observable<AccessToken | null> {
    const token: AccessToken | null = this.storage.get(
      this.ACCESS_TOKEN_IDENTIFIER
    );
    if (!(token && requiresRefresh(token))) {
      return of(token);
    }
    if (canRenew(token)) {
      return this.renew(token as Required<AccessToken>);
    }
    this.remove();
    return of(null);
  }

  remove(): void {
    this.storage.remove(this.ACCESS_TOKEN_IDENTIFIER);
  }

  /**
   * @param params contains the exchange parameters such as username and password.
   */
  load(params: TokenExchangeParams): Observable<AccessToken> {
    const { username, password } = params;
    const body = `grant_type=password&username=${username}&password=${password}`;
    return this.request({
      body: body,
    });
  }

  renew(token: Required<AccessToken>): Observable<AccessToken> {
    return this.request({
      body: `grant_type=refresh_token&refresh_token=${token.refreshToken}`,
    });
  }

  protected request(options: { body: any }): Observable<AccessToken> {
    return this.http
      .request(`${this.apiUrl}/token`, {
        body: options.body,
        method: 'POST',
        headers: this.AUTH_HEADERS,
      })
      .pipe(
        catchError((e) => {
          return throwError(() => e);
        }),
        map((source: any) => this.convertResponse(source)),
        tap((token: AccessToken) => {
          this.storage.set(this.ACCESS_TOKEN_IDENTIFIER, token);
        })
      );
  }

  protected convertResponse(source: any): AccessToken {
    const token: AccessToken = {
      accessToken: source.access_token,
    };
    if (source.token_type) {
      token.tokenType = source.token_type;
    }
    if (source.expires_in) {
      token.expiresAt = Date.now() + toMilliseconds(source.expires_in);
    }
    if (source.refresh_token) {
      token.refreshToken = source.refresh_token;
      if (source.refreshTokenExpiresAt) {
        token.refreshTokenExpiresAt = toMilliseconds(
          source.refreshTokenExpiresAt
        );
      }
    }

    return token;
  }
}
