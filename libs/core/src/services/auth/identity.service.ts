import { AuthHeaders, Identity } from '@spryker-oryx/core';
import { Observable } from 'rxjs';

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
