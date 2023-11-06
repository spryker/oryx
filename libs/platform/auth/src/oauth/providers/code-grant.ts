import { StorageService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  authorizationCodeGrantRequest,
  AuthorizationServer,
  calculatePKCECodeChallenge,
  Client,
  generateRandomCodeVerifier,
  isOAuth2Error,
  parseWwwAuthenticateChallenges,
  processAuthorizationCodeOAuth2Response,
  processRefreshTokenResponse,
  processRevocationResponse,
  refreshTokenGrantRequest,
  revocationRequest,
  skipStateCheck,
  validateAuthResponse,
  WWWAuthenticateChallenge,
} from 'oauth4webapi';
import {
  defer,
  EMPTY,
  map,
  Observable,
  of,
  ReplaySubject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { OauthProviderConfigBase, OauthProviderRequest } from '../config.model';
import { OauthProvider } from '../provider.model';
import { OauthResponseSuccess } from '../response.model';

declare global {
  interface OauthProvidersMap {
    authorization_code: {
      provider: OauthCodeGrantProvider;
      config: OauthCodeGrantProviderConfig;
    };
  }
}

export class OauthCodeGrantProvider implements OauthProvider {
  protected static readonly STATE_KEY = 'oryx.oauth-token';

  protected state$ = new ReplaySubject<OauthCodeGrantState | undefined>(1);

  constructor(
    protected readonly config: OauthCodeGrantProviderConfig,
    protected readonly storage = inject(StorageService)
  ) {
    this.restoreState();
  }

  authenticate(request?: OauthProviderRequest): Observable<never> {
    return this.state$.pipe(
      take(1),
      switchMap(async (state) => {
        if (state?.state === 'authenticated') {
          throw new Error('Already authenticated!');
        }

        const pkce = await this.generatePKCE();
        const authUrl = this.getAuthUrlFor(request, pkce);

        return { authUrl, pkce };
      }),
      switchMap((state) =>
        this.updateState({
          state: 'authenticating',
          providerId: this.config.id,
          codeVerifier: state.pkce?.codeVerifier,
        }).pipe(map(() => state))
      ),
      switchMap((state) => {
        this.redirectTo(state.authUrl);
        return EMPTY;
      })
    );
  }

  handleCallback(url: URL): Observable<void> {
    return this.tokenRequest(url).pipe(
      switchMap((response) => this.handleTokenResponse(response))
    );
  }

  revoke(): Observable<void> {
    if (!this.config.revocationUrl) {
      return this.updateState();
    }

    return this.revocationRequest().pipe(
      switchMap((response) => this.handleRevocationResponse(response))
    );
  }

  refreshToken(): Observable<void> {
    return this.refreshRequest().pipe(
      switchMap((response) => this.handleRefreshResponse(response))
    );
  }

  getToken(): Observable<OauthResponseSuccess> {
    return this.state$.pipe(
      map((state) => {
        if (state?.state !== 'authenticated') {
          throw new Error('Not authenticated!');
        }

        return state.token;
      })
    );
  }

  protected getAuthUrlFor(
    request?: OauthProviderRequest,
    pkce?: OauthCodeGrantPKCEState
  ): URL {
    const authUrl = new URL(this.config.authUrl);
    authUrl.searchParams.set('client_id', this.config.clientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', this.config.redirectUrl);

    const scope = this.getScopeFor(request);

    if (scope) {
      authUrl.searchParams.set('scope', scope);
    }

    if (pkce) {
      authUrl.searchParams.set('code_challenge', pkce.codeChallenge);
      authUrl.searchParams.set('code_challenge_method', pkce.method);
    }

    return authUrl;
  }

  protected getScopeFor(request?: OauthProviderRequest): string | undefined {
    return request?.scope && this.config.scope
      ? `${request?.scope} ${this.config.scope}`
      : request?.scope ?? this.config.scope;
  }

  protected async generatePKCE(): Promise<OauthCodeGrantPKCEState | undefined> {
    switch (this.config.pkceMethod ?? OauthCodeGrantPKCEMethod.S256) {
      case OauthCodeGrantPKCEMethod.S256: {
        const codeVerifier = generateRandomCodeVerifier();
        const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);

        return {
          codeVerifier,
          codeChallenge,
          method: 'S256',
        };
      }
      case OauthCodeGrantPKCEMethod.Plain: {
        const codeVerifier = generateRandomCodeVerifier();

        return {
          codeVerifier,
          codeChallenge: codeVerifier,
          method: 'plain',
        };
      }
      default: {
        return;
      }
    }
  }

  protected getAuthServer(): AuthorizationServer {
    return {
      issuer: new URL(this.config.authUrl).hostname,
      authorization_endpoint: this.config.authUrl,
      token_endpoint: this.config.tokenUrl,
      revocation_endpoint: this.config.revocationUrl,
    };
  }

  protected getClient(): Client {
    return {
      client_id: this.config.clientId,
      token_endpoint_auth_method: 'none',
    };
  }

  protected tokenRequest(url: URL): Observable<Response> {
    return this.state$.pipe(
      take(1),
      switchMap((state) => {
        if (state?.state !== 'authenticating') {
          throw new Error('Invalid Oauth state!');
        }

        const params = validateAuthResponse(
          this.getAuthServer(),
          this.getClient(),
          url,
          skipStateCheck
        );

        if (isOAuth2Error(params)) {
          throw new Error(`Oauth token request error: ${String(params)}`);
        }

        return authorizationCodeGrantRequest(
          this.getAuthServer(),
          this.getClient(),
          params,
          this.config.redirectUrl,
          state.codeVerifier ?? ''
        );
      })
    );
  }

  protected handleTokenResponse(response: Response): Observable<void> {
    return defer(() => {
      const challenges = parseWwwAuthenticateChallenges(response);

      if (challenges) {
        return this.handleWwwAuthenticateChallenges(challenges);
      }

      return of(undefined);
    }).pipe(
      switchMap(async () => {
        const result = await processAuthorizationCodeOAuth2Response(
          this.getAuthServer(),
          this.getClient(),
          response
        );

        if (isOAuth2Error(result)) {
          throw new Error(`Oauth token response error: ${String(result)}`);
        }

        return result as OauthResponseSuccess;
      }),
      switchMap((token) =>
        this.updateState({
          state: 'authenticated',
          token,
        })
      )
    );
  }

  protected handleWwwAuthenticateChallenges(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    challenges: WWWAuthenticateChallenge[]
  ): Observable<void> {
    throw new Error('Oauth www-authenticate challenges are not supported!');
  }

  protected refreshRequest(): Observable<Response> {
    return this.state$.pipe(
      take(1),
      switchMap((state) => {
        if (state?.state !== 'authenticated') {
          throw new Error('Invalid Oauth state!');
        }

        if (!state.token.refresh_token) {
          throw new Error(
            'Oauth server does not support token refresh! Use login instead!'
          );
        }

        return refreshTokenGrantRequest(
          this.getAuthServer(),
          this.getClient(),
          state.token.refresh_token
        );
      })
    );
  }

  protected handleRefreshResponse(response: Response): Observable<void> {
    return defer(async () => {
      const result = await processRefreshTokenResponse(
        this.getAuthServer(),
        this.getClient(),
        response
      );

      if (isOAuth2Error(result)) {
        throw new Error(`Oauth token refresh error: ${String(result)}`);
      }

      return result as OauthResponseSuccess;
    }).pipe(
      switchMap((token) => this.updateState({ state: 'authenticated', token }))
    );
  }

  protected revocationRequest(): Observable<Response> {
    return this.state$.pipe(
      take(1),
      switchMap((state) => {
        if (state?.state !== 'authenticated') {
          throw new Error('Invalid Oauth state!');
        }

        return revocationRequest(
          this.getAuthServer(),
          this.getClient(),
          state.token.access_token,
          {
            additionalParameters: new URLSearchParams({
              token_type_hint: 'access_token',
            }),
          }
        );
      })
    );
  }

  protected handleRevocationResponse(response: Response): Observable<void> {
    return defer(async () => {
      const result = await processRevocationResponse(response);

      if (isOAuth2Error(result)) {
        throw new Error(`Oauth token revocation error: ${String(result)}`);
      }
    }).pipe(switchMap(() => this.updateState()));
  }

  protected restoreState(): void {
    this.storage
      .get<OauthCodeGrantState>(OauthCodeGrantProvider.STATE_KEY)
      .subscribe((state) => this.state$.next(state ?? undefined));
  }

  protected updateState(state?: OauthCodeGrantState): Observable<void> {
    return (
      state
        ? this.storage.set(OauthCodeGrantProvider.STATE_KEY, state)
        : this.storage.remove(OauthCodeGrantProvider.STATE_KEY)
    ).pipe(tap(() => this.state$.next(state)));
  }

  protected redirectTo(url: URL): void {
    globalThis.location.href = url.toString();
  }
}

type OauthCodeGrantState =
  | OauthCodeGrantStateAuthorizing
  | OauthCodeGrantStateAuthorized;

interface OauthCodeGrantStateAuthorizing {
  state: 'authenticating';
  providerId: string;
  codeVerifier?: string;
}

interface OauthCodeGrantStateAuthorized {
  state: 'authenticated';
  token: OauthResponseSuccess;
}

interface OauthCodeGrantPKCEState {
  codeVerifier: string;
  codeChallenge: string;
  method: string;
}

export interface OauthCodeGrantProviderConfig extends OauthProviderConfigBase {
  grantType: 'authorization_code';
  authUrl: string;
  tokenUrl: string;
  redirectUrl: string;
  revocationUrl?: string;
  pkceMethod?: OauthCodeGrantPKCEMethod;
}

export enum OauthCodeGrantPKCEMethod {
  S256 = 'S256',
  Plain = 'plain',
  None = 'none',
}
