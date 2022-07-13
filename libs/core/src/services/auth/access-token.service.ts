import { Observable } from 'rxjs';
import { AccessToken, TokenExchangeParams } from './model';

export const AccessTokenService = 'FES.AccessTokenService';

export interface AccessTokenService {
  get(): Observable<AccessToken | null>;
  remove(): void;
  load(params: TokenExchangeParams): Observable<AccessToken>;
  renew(token: Required<AccessToken>): Observable<AccessToken>;
}

declare global {
  interface InjectionTokensContractMap {
    [AccessTokenService]: AccessTokenService;
  }
}
