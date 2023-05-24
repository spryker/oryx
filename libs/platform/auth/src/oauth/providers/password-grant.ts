import { HttpService, StorageService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  Observable,
  of,
  ReplaySubject,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { OauthProviderConfigBase, OauthProviderRequest } from '../config.model';
import { OauthTokenInterceptor } from '../oauth-token.interceptor';
import { OauthProvider } from '../provider.model';
import { OauthResponseSuccess } from '../response.model';

declare global {
  interface OauthProvidersMap {
    password: {
      provider: OauthPasswordGrantProvider;
      config: OauthPasswordGrantProviderConfig;
    };
  }
}

export class OauthPasswordGrantProvider implements OauthProvider {
  protected static readonly TOKEN_KEY = 'oryx.oauth-token';

  protected token$ = new ReplaySubject<OauthResponseSuccess | undefined>(1);

  constructor(
    protected readonly config: OauthPasswordGrantProviderConfig,
    protected readonly http = inject(HttpService),
    protected readonly storage = inject(StorageService)
  ) {
    this.restoreToken();
  }

  authenticate(request?: OauthPasswordProviderRequest): Observable<void> {
    return this.token$.pipe(
      take(1),
      switchMap((token) => {
        if (token) {
          return throwError(() => new Error('Already authenticated!'));
        }

        if (!request || !request.username || !request.password) {
          return throwError(() => new Error('Missing username/password!'));
        }

        request.grant_type = this.config.grantType;
        request.client_id = this.config.clientId;

        return this.tokenRequest(request);
      })
    );
  }

  getToken(): Observable<OauthResponseSuccess> {
    return this.token$.pipe(
      switchMap((token) =>
        token ? of(token) : throwError(() => new Error('Not authenticated!'))
      )
    );
  }

  refreshToken(): Observable<void> {
    return this.token$.pipe(
      take(1),
      switchMap((token) => {
        if (!token?.refresh_token) {
          return of(undefined);
        }

        const data = {
          grant_type: 'refresh_token',
          refresh_token: token.refresh_token,
        };

        return this.tokenRequest(data);
      })
    );
  }

  revoke(): Observable<void> {
    return this.updateToken();
  }

  protected tokenRequest(data: Record<string, unknown>): Observable<void> {
    if (this.config.scope) {
      data.scope = data.scope
        ? `${data.scope} ${this.config.scope}`
        : this.config.scope;
    }

    return this.http
      .request<OauthResponseSuccess>(this.config.tokenUrl, {
        body: new URLSearchParams(data as Record<string, string>),
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          [OauthTokenInterceptor.HEADER_NAME]: 'password',
        },
      })
      .pipe(switchMap((response) => this.updateToken(response)));
  }

  protected restoreToken(): void {
    this.storage
      .get<OauthResponseSuccess>(OauthPasswordGrantProvider.TOKEN_KEY)
      .subscribe((token) => this.token$.next(token ?? undefined));
  }

  protected updateToken(token?: OauthResponseSuccess): Observable<void> {
    return (
      token
        ? this.storage.set(OauthPasswordGrantProvider.TOKEN_KEY, token)
        : this.storage.remove(OauthPasswordGrantProvider.TOKEN_KEY)
    ).pipe(tap(() => this.token$.next(token)));
  }
}

export interface OauthPasswordGrantProviderConfig
  extends OauthProviderConfigBase {
  grantType: 'password';
  tokenUrl: string;
}

export interface OauthPasswordProviderRequest extends OauthProviderRequest {
  username: string;
  password: string;
}
