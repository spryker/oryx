import { Observable } from 'rxjs';

export interface BapiPushNotificationService {
  initSubscription(): Observable<void>;
  unsubscribe(): Observable<void>;
}

export const BapiPushNotificationService = 'oryx.BapiPushNotificationService';

declare global {
  interface InjectionTokensContractMap {
    [BapiPushNotificationService]: BapiPushNotificationService;
  }
}
