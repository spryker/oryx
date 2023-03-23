import { Observable } from 'rxjs';

export interface PushProvider<TSubscription = unknown> {
  init(): Observable<void>;
  getSubscription(): Observable<TSubscription>;
  deleteSubscription(): Observable<boolean>;
}

export const PushProvider = 'oryx.PushProvider';

declare global {
  export interface InjectionTokensContractMap {
    [PushProvider]: PushProvider;
  }
}
