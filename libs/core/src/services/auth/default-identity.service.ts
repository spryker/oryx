import {
  AccessToken,
  AccessTokenService,
  AuthHeaders,
  generateID,
  Identity,
  JWTTokenPayload,
  parseToken,
  StorageService,
  StorageType,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import {
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { IdentityService } from './identity.service';
import { Headers } from './model';

export class DefaultIdentityService implements IdentityService {
  protected ANONYMOUS_USER_IDENTIFIER = 'anonymous-user';

  constructor(
    protected storage = inject(StorageService),
    protected accessToken = inject(AccessTokenService)
  ) {}

  protected identity$: Observable<Identity> = this.accessToken.get().pipe(
    switchMap((token) =>
      token
        ? this.getFromToken(token).pipe(tap(() => this.clearAnonymousId()))
        : this.getAnonymous()
    ),
    shareReplay(1)
  );

  protected headers$: Observable<AuthHeaders> = this.identity$.pipe(
    map(
      (identity) =>
        (!identity.anonymous && identity.token
          ? {
              [Headers.Authorization]: `${identity.token.tokenType} ${identity.token.accessToken}`,
            }
          : {
              [Headers.AnonymousCustomerUniqueId]: identity.id,
            }) as AuthHeaders
    )
  );

  get(): Observable<Identity> {
    return this.identity$;
  }

  getHeaders(): Observable<AuthHeaders> {
    return this.headers$;
  }

  protected getFromToken(token: AccessToken): Observable<Identity> {
    let id: string | undefined;
    try {
      const tokenPayload = parseToken<JWTTokenPayload>(token.accessToken);
      id = tokenPayload.sub.customer_reference;
      // eslint-disable-next-line no-empty
    } catch (e) {}
    return id
      ? of({ id, anonymous: false, token })
      : throwError(() => new Error('Unable to retrieve user ID'));
  }

  protected getAnonymous(): Observable<Identity> {
    return this.storage
      .get<string>(this.ANONYMOUS_USER_IDENTIFIER, StorageType.SESSION)
      .pipe(
        switchMap((anonymousId) => {
          return anonymousId ? of(anonymousId) : this.createAnonymousId();
        }),
        map((id) => ({ id, anonymous: true }))
      );
  }

  protected createAnonymousId(): Observable<string> {
    const userId = generateID(8);
    return this.storage
      .set(this.ANONYMOUS_USER_IDENTIFIER, userId, StorageType.SESSION)
      .pipe(map(() => userId));
  }

  protected clearAnonymousId(): void {
    this.storage
      .remove(this.ANONYMOUS_USER_IDENTIFIER, StorageType.SESSION)
      .subscribe();
  }
}
