import { inject } from '@spryker-oryx/di';
import { PickingHttpService } from '@spryker-oryx/picking';
import { Observable } from 'rxjs';
import { BapiPushNotificationAdapter } from './bapi-push-notification.adapter';

export class BapiPushNotificationDefaultAdapter
  implements BapiPushNotificationAdapter
{
  constructor(protected pickingHttpService = inject(PickingHttpService)) {}
  sendSubscription(subscription: PushSubscriptionJSON): Observable<void> {
    return this.pickingHttpService.post(
      '/push-notification-subscriptions',
      {
        data: {
          type: 'push-notification-subscriptions',
          attributes: {
            providerName: 'web-push-php',
            group: {
              name: 'warehouse',
              //TODO: update warehouse info once we ingrate this feature with BAPI.
              identifier: 'e84b3cb8-a94a-5a7e-9adb-cc5353f7a73f',
            },
            payload: subscription,
          },
        },
      },
    );
  }
}
