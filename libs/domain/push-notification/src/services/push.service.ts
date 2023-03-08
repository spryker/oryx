import { Observable } from 'rxjs';

export interface PushService {
  init(): Observable<void>;
  subscribe(): Observable<any>;
  unsubscribe(): Observable<boolean>;
}

export const PushService = 'oryx.PushService';

declare global {
  export interface InjectionTokensContractMap {
    [PushService]: PushService;
  }
}
