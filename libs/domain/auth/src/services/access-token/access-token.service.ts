import { Observable } from 'rxjs';
import { AccessToken } from '../../models';

export const AccessTokenService = 'oryx.AccessTokenService';

export interface AccessTokenService {
  set(props: { token: AccessToken; persist?: boolean }): Observable<unknown>;
  get(): Observable<AccessToken | null>;
  remove(): Observable<unknown>;
}

declare global {
  interface InjectionTokensContractMap {
    [AccessTokenService]: AccessTokenService;
  }
}
