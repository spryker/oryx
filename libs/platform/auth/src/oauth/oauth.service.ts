import { StorageService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { subscribeReplay } from '@spryker-oryx/utilities';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  from,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { AuthService, AuthTokenData, AuthTokenService } from '../services';
import {
  InferOauthConfig,
  OauthProviderConfig,
  OauthProviderRequest,
} from './config.model';
import { OauthProviderFactoryService } from './provider-factory.service';
import { OauthProvider } from './provider.model';
import { OauthResponseSuccess } from './response.model';

export class OauthService implements AuthService, AuthTokenService {
  protected static readonly STATE_KEY = 'oryx.oauth-state';

  protected state$ = new BehaviorSubject<OauthServiceState>({});

  protected oauthToken$ = this.state$.pipe(
    switchMap(() =>
      this.getCurrentProvider().pipe(
        switchMap((provider) => provider.getToken())
      )
    ),
    shareReplay(1)
  );

  protected token$ = this.state$.pipe(
    switchMap(() =>
      this.oauthToken$.pipe(
        map((token) => ({ token: token.access_token, type: token.token_type }))
      )
    ),
    shareReplay(1)
  );

  protected isAuthenticated$ = this.state$.pipe(
    switchMap(() =>
      this.token$.pipe(
        map((data) => !!data.token),
        catchError(() => of(false))
      )
    ),
    distinctUntilChanged(),
    shareReplay(1)
  );

  constructor(
    protected readonly config = inject(OauthServiceConfig),
    protected readonly providerFactoryService = inject(
      OauthProviderFactoryService
    ),
    protected readonly routerService = inject(RouterService),
    protected readonly storageService = inject(StorageService)
  ) {
    this.restoreState();
  }

  login(): Observable<void> {
    return subscribeReplay(
      this.isAuthenticated().pipe(
        take(1),
        switchMap((isAuthenticated) => {
          if (isAuthenticated) {
            return throwError(
              () => new Error(`OauthService: Already authenticated!`)
            );
          }

          if (this.config.defaultProvider) {
            return this.loginWith(this.config.defaultProvider);
          }

          this.routerService.navigate(this.config.loginRoute);

          return of(undefined);
        })
      )
    );
  }

  logout(): Observable<void> {
    return subscribeReplay(
      this.getCurrentProvider().pipe(
        take(1),
        switchMap((provider) => provider.revoke?.() ?? of(undefined)),
        switchMap(() => this.updateState())
      )
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  refreshToken(): Observable<void> {
    return subscribeReplay(
      this.getCurrentProvider().pipe(
        take(1),
        switchMap((provider) => provider.refreshToken?.() ?? of(undefined))
      )
    );
  }

  invokeStoredToken(): void {
    this.restoreState();
  }

  getToken(): Observable<AuthTokenData> {
    return this.token$;
  }

  getOauthToken(): Observable<OauthResponseSuccess> {
    return this.oauthToken$;
  }

  loginWith(
    providerId: string,
    request?: OauthProviderRequest
  ): Observable<void> {
    return subscribeReplay(
      this.createProvider(providerId).pipe(
        take(1),
        switchMap((provider) => provider.authenticate(request)),
        switchMap(() => this.updateState(providerId))
      )
    );
  }

  handleCallback(providerId: string): Observable<void> {
    return subscribeReplay(
      this.createProvider(providerId).pipe(
        take(1),
        switchMap(
          (provider) =>
            provider
              .handleCallback?.(new URL(globalThis.location.href))
              .pipe(switchMap(() => this.updateState(providerId))) ??
            of(undefined)
        )
      )
    );
  }

  protected createProvider(providerId: string): Observable<OauthProvider> {
    const config = this.findProviderConfig(providerId);

    if (!config) {
      return throwError(
        () =>
          new Error(`OauthService: Unknown Oauth provider ID '${providerId}'!`)
      );
    }

    return from(
      this.providerFactoryService.create(config as InferOauthConfig<never>)
    );
  }

  protected findProviderConfig(
    providerId: string
  ): OauthProviderConfig | undefined {
    return this.config.providers.find((config) => config.id === providerId);
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
    this.storageService
      .get<OauthServiceState>(OauthService.STATE_KEY)
      .pipe(distinctUntilChanged())
      .subscribe((state) => this.state$.next({ ...state }));
  }

  protected updateState(providerId?: string): Observable<void> {
    const newState: OauthServiceState = providerId
      ? { authorizedBy: providerId }
      : {};

    return this.storageService.set(OauthService.STATE_KEY, newState).pipe(
      // Delay state update to microtask to let take(1) unsubscribe
      // as getCurrentProvider() will throw as soon as state is updated
      switchMap(() => Promise.resolve()),
      tap(() => this.state$.next(newState))
    );
  }
}

export interface OauthServiceState {
  authorizedBy?: string;
}

export interface OauthServiceConfig {
  readonly loginRoute: string;
  readonly providers: OauthProviderConfig[];
  readonly defaultProvider?: string;
}

export const OauthServiceConfig = 'oryx.OauthServiceConfig';

declare global {
  interface InjectionTokensContractMap {
    [OauthServiceConfig]: OauthServiceConfig;
  }
}
