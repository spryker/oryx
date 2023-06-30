import {
  AuthTokenData,
  OauthProvider,
  OauthProviderConfig,
  OauthProviderRequest,
  OauthResponseSuccess,
  OauthResponseTokenType,
  OauthService,
  OauthServiceState
} from '@spryker-oryx/auth';
import {BehaviorSubject, from, map, Observable, of, switchMap, take, tap, throwError} from 'rxjs';

export class MockOauthService implements OauthService, OauthProvider
{
  protected state$ = new BehaviorSubject<OauthServiceState>({});

  protected oauthToken$ = new BehaviorSubject<OauthResponseSuccess>({
    access_token: 'mock_access_token',
    token_type: 'bearer' as OauthResponseTokenType
  });

  protected token$ = new BehaviorSubject<{token: string, type: 'bearer'}>({
    token: 'mock_token',
    type: 'bearer'
  });

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

  refreshToken(): Observable<void> {
    return of(undefined);
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

  getOauthToken(): Observable<OauthResponseSuccess> {
    return this.oauthToken$;
  }

  loginWith(
    providerId: string,
    request?: OauthProviderRequest
  ): Observable<void> {
    return of(undefined);
  }

  handleCallback(providerId: string): Observable<void> {
    return of(undefined);
  }

  protected createProvider(providerId: string): Observable<OauthProvider> {
    return of(undefined);
  }

  protected findProviderConfig(
    providerId: string
  ): OauthProviderConfig | undefined {
    return undefined;
  }

  protected getCurrentProvider(): Observable<OauthProvider> {
    return this.getState().pipe(
      switchMap((state) =>
        state.authorizedBy
          ? this.createProvider(state.authorizedBy)
          : throwError(() => new Error('OauthService: Not authenticated!'))
      )
    );
  }

  protected getState(): Observable<OauthServiceState> {
    return this.state$;
  }

  protected restoreState(): void {
    return;
  }

  protected updateState(providerId?: string): Observable<void> {
    return of(undefined);
  }
}
