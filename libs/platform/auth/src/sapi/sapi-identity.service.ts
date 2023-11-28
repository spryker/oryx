import {
  AuthIdentity,
  AuthService,
  AuthTokenData,
  AuthTokenService,
  IdentityOptions,
  IdentityService,
} from '@spryker-oryx/auth';
import { StorageService, StorageType } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { generateID } from '../services/utils';
import { parseToken } from './utils';

export class SapiIdentityService implements IdentityService {
  protected ANONYMOUS_USER_IDENTIFIER = 'oryx.anonymous-user';

  protected generateGuest$ = new BehaviorSubject<boolean>(false);

  protected identity$ = this.authService.isAuthenticated().pipe(
    switchMap(() =>
      this.authTokenService.getToken().pipe(
        featureVersion >= '1.4'
          ? switchMap((token) => this.getUserIdFromToken(token))
          : map((token) => this.getFromToken(token)),
        tap(() => this.clearAnonymousId()),
        catchError(() => this.guestIdentity$)
      )
    ),
    shareReplay(1)
  );

  protected guestIdentity$: Observable<AuthIdentity> = this.storage
    .get<string>(this.ANONYMOUS_USER_IDENTIFIER, StorageType.Session)
    .pipe(
      switchMap((userId) => {
        if (!userId) {
          return this.generateGuest$.pipe(
            switchMap((generate) =>
              generate ? this.createAnonymousId() : of(undefined)
            )
          );
        } else {
          return of(userId);
        }
      }),
      map((userId) => ({ isAuthenticated: false, userId }))
    );

  constructor(
    protected readonly authService = inject(AuthService),
    protected readonly authTokenService = inject(AuthTokenService),
    protected readonly storage = inject(StorageService)
  ) {}

  get(options?: IdentityOptions): Observable<AuthIdentity> {
    if (options?.requireGuest) {
      if (!this.generateGuest$.value) this.generateGuest$.next(true);
      return this.identity$.pipe(filter((identity) => !!identity.userId));
    }
    return this.identity$;
  }

  protected getFromToken(token: AuthTokenData): AuthIdentity {
    if (token.type === 'anon') {
      return {
        isAuthenticated: false,
        userId: token.token as string | undefined,
      };
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tokenPayload = parseToken<SapiJWTPayload>(token.token!);
      const userId = tokenPayload.sub.customer_reference;

      if (!userId) {
        throw new Error('customer_reference is missing in sub claim!');
      }

      return { isAuthenticated: true, userId };
    } catch (e) {
      throw new Error(`Unable to get user ID from access token: ${String(e)}`);
    }
  }

  protected getUserIdFromToken(token: AuthTokenData): Observable<AuthIdentity> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tokenPayload = parseToken<SapiJWTPayload>(token.token!);
      const userId = tokenPayload.sub.customer_reference;

      if (!userId) {
        throw new Error('customer_reference is missing in sub claim!');
      }

      return of({ isAuthenticated: true, userId });
    } catch (e) {
      throw new Error(`Unable to get user ID from access token: ${String(e)}`);
    }
  }

  protected createAnonymousId(): Observable<string> {
    const userId = generateID(8);
    return this.storage
      .set(this.ANONYMOUS_USER_IDENTIFIER, userId, StorageType.Session)
      .pipe(map(() => userId));
  }

  protected clearAnonymousId(): void {
    this.storage
      .remove(this.ANONYMOUS_USER_IDENTIFIER, StorageType.Session)
      .subscribe();
  }
}

interface SapiJWTPayload {
  aud: string;
  exp: number;
  iat: number;
  jti: string;
  nbf: number;
  scopes: string[];
  sub: {
    customer_reference: string;
    id_agent: unknown;
    id_company_user: string;
    id_customer: number;
    permissions: unknown[];
  };
}
