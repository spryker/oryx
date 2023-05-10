import { Observable } from 'rxjs';

export interface BapiPushNotificationAdapter {
  sendSubscription(subscription: PushSubscriptionJSON): Observable<void>;
}

export const BapiPushNotificationAdapter = 'oryx.BapiPushNotificationAdapter';

declare global {
  interface InjectionTokensContractMap {
    [BapiPushNotificationAdapter]: BapiPushNotificationAdapter;
  }
}
