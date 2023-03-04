import {
  AuthIdentity,
  AuthTokenData,
  AuthTokenService,
  IdentityService,
} from '@spryker-oryx/auth';
import { inject } from '@spryker-oryx/di';
import { map, Observable, shareReplay } from 'rxjs';
import { parseToken } from './utils';

export class SapiIdentityService implements IdentityService {
  protected identity$ = this.authService.getToken().pipe(
    map((token) => this.getFromToken(token)),
    shareReplay(1)
  );

  constructor(protected readonly authService = inject(AuthTokenService)) {}

  get(): Observable<AuthIdentity> {
    return this.identity$;
  }

  protected getFromToken(token: AuthTokenData): AuthIdentity {
    if (token.type === 'anon') {
      return { isAuthenticated: false, userId: token.token };
    }

    try {
      const tokenPayload = parseToken<SapiJWTPayload>(token.token);
      const userId = tokenPayload.sub.customer_reference;

      if (!userId) {
        throw new Error('customer_reference is missing in sub claim!');
      }

      return { isAuthenticated: true, userId };
    } catch (e) {
      throw new Error(`Unable to get user ID from access token: ${String(e)}`);
    }
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
