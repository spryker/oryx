import { Observable } from 'rxjs';

export interface BapiPushNotificationService {
  // implement AppInitializer and provide it
  initSubscription(): Observable<void>;
  unsubscribe(): Observable<boolean>
}

export const BapiPushNotificationService = 'oryx.BapiPushNotificationService';

declare global {
  interface InjectionTokensContractMap {
    [BapiPushNotificationService]: BapiPushNotificationService;
  }
}
