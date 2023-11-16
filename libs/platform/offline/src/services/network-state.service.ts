import { Observable } from 'rxjs';

export type NetworkState = 'online' | 'offline';

export interface NetworkStateService {
  get(): Observable<NetworkState>;
}

export const NetworkStateService = 'oryx.NetworkStateService';

declare global {
  export interface InjectionTokensContractMap {
    [NetworkStateService]: NetworkStateService;
  }
}
