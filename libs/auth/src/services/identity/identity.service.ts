import { Observable } from 'rxjs';
import { AuthHeaders, Identity } from '../../models';

export const IdentityService = 'FES.IdentityService';

export interface IdentityService {
  get(): Observable<Identity>;
  getHeaders(): Observable<AuthHeaders>;
}

declare global {
  interface InjectionTokensContractMap {
    [IdentityService]: IdentityService;
  }
}
