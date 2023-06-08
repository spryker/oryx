import { Observable } from 'rxjs';

export interface BapiPushNotificationAdapter {
  sendSubscription(subscription: unknown): Observable<void>;
}

export const BapiPushNotificationAdapter = 'oryx.BapiPushNotificationAdapter';

declare global {
  interface InjectionTokensContractMap {
    [BapiPushNotificationAdapter]: BapiPushNotificationAdapter;
  }
}
