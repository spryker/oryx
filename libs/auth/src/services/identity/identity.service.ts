import { Observable } from 'rxjs';
import { Identity } from '../../models';

export const IdentityService = 'FES.IdentityService';

export interface IdentityService {
  get(): Observable<Identity>;
}

declare global {
  interface InjectionTokensContractMap {
    [IdentityService]: IdentityService;
  }
}
