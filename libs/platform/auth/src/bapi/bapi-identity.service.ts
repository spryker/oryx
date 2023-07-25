import {
  AuthIdentity,
  IdentityService,
  OauthResponseSuccess,
  OauthService,
} from '../index';
import { inject } from '@spryker-oryx/di';
import { getValidatedIdTokenClaims, TokenEndpointResponse } from 'oauth4webapi';
import { catchError, map, Observable, of, shareReplay, switchMap } from 'rxjs';

export class BapiIdentityService implements IdentityService {
  protected indentity$: Observable<AuthIdentity> = this.oauthService
    .isAuthenticated()
    .pipe(
      switchMap(() =>
        this.oauthService.getOauthToken().pipe(
          map(
            (token) =>
              ({
                isAuthenticated: true,
                userId: this.getUserIdFrom(token),
              } as AuthIdentity)
          ),
          catchError(() => of({ isAuthenticated: false } as AuthIdentity))
        )
      ),
      shareReplay(1)
    );

  constructor(protected readonly oauthService = inject(OauthService)) {}

  get(): Observable<AuthIdentity> {
    return this.indentity$;
  }

  protected getUserIdFrom(token: OauthResponseSuccess): string {
    try {
      const claims = getValidatedIdTokenClaims(token as TokenEndpointResponse);

      if (!claims?.sub) {
        throw new Error(`'sub' claim is not available in the token!`);
      }

      const sub = JSON.parse(claims.sub) as BapiOauthTokenSubClaims;
      const userId = sub.id_user;

      if (!userId) {
        throw new Error(`'id_user' does not exist in 'sub' claim!`);
      }

      return userId;
    } catch (e) {
      throw new Error(`BapiIdentityService: Invalid 'sub' claim: ${String(e)}`);
    }
  }
}

export interface BapiOauthTokenSubClaims {
  id_user: string;
}
