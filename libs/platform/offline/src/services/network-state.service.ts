import { Observable } from 'rxjs';

export interface NetworkStateService {
  online(): Observable<boolean>;
}

export const NetworkStateService = 'oryx.NetworkStateService';

declare global {
  export interface InjectionTokensContractMap {
    [NetworkStateService]: NetworkStateService;
  }
}
