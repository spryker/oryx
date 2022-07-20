import { inject } from '@spryker-oryx/injector';
import { toMilliseconds } from '@spryker-oryx/typescript-utils';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  Observable,
  switchMap,
  switchMapTo,
  tap,
  throwError,
} from 'rxjs';
import { HttpService } from '../http/http.service';
import { StorageService, StorageType } from '../storage';
import { AccessTokenService } from './access-token.service';
import { AccessToken, TokenExchangeParams } from './model';
import { canRenew, requiresRefresh } from './utils';

export class DefaultAccessTokenService implements AccessTokenService {
  protected ACCESS_TOKEN_IDENTIFIER = 'access-token';
  protected PERSIST_TOKEN_IDENTIFIER = 'access-token-persist';
  protected AUTH_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  protected token$ = new BehaviorSubject<AccessToken | null>(null);
  constructor(
    protected http = inject(HttpService),
    protected apiUrl = inject('SCOS_BASE_URL'),
    protected storage = inject(StorageService)
  ) {}
  get(): Observable<AccessToken | null> {
    return this.storageType().pipe(
      switchMap((storageType) =>
        this.storage
          .get<AccessToken>(this.ACCESS_TOKEN_IDENTIFIER, storageType)
          .pipe(
            switchMap((token) => {
              if (!(token && requiresRefresh(token))) {
                this.token$.next(token);
                return this.token$;
              }
              if (token && canRenew(token)) {
                return this.renew(token as Required<AccessToken>).pipe(
                  switchMapTo(this.token$)
                );
              }
              this.remove();
              return this.token$;
            })
          )
      )
    );
  }

  remove(): Observable<void> {
    return this.storageType().pipe(
      switchMap((storageType: StorageType) =>
        this.storage.remove(this.ACCESS_TOKEN_IDENTIFIER, storageType)
      ),
      tap(() => {
        this.token$.next(null);
      })
    );
  }

  /**
   * @param params contains the exchange parameters such as username and password.
   */
  load(params: TokenExchangeParams): Observable<AccessToken> {
    const { username, password, persist } = params;
    this.setPersistence(persist ?? false);
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

  protected setPersistence(persist: boolean): void {
    this.storage.set(this.PERSIST_TOKEN_IDENTIFIER, persist);
  }

  protected storageType(): Observable<StorageType> {
    return this.storage
      .get(this.PERSIST_TOKEN_IDENTIFIER)
      .pipe(
        map((persist) => (persist ? StorageType.DEFAULT : StorageType.SESSION))
      );
  }

  protected request(options: { body: any }): Observable<AccessToken> {
    return combineLatest([
      this.http.request(`${this.apiUrl}/token`, {
        body: options.body,
        method: 'POST',
        headers: this.AUTH_HEADERS,
      }),
      this.storageType(),
    ]).pipe(
      catchError((e) => {
        return throwError(() => e);
      }),
      map(([source, storage]) => {
        const token = this.convertResponse(source);
        this.storage.set(this.ACCESS_TOKEN_IDENTIFIER, token, storage);
        this.token$.next(token);
        return token;
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
