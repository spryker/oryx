import { inject } from '@spryker-oryx/di';
import { PickingHttpService } from '@spryker-oryx/picking';
import { Observable } from 'rxjs';
import { BapiPushNotificationAdapter } from './bapi-push-notification.adapter';

export class BapiPushNotificationDefaultAdapter
  implements BapiPushNotificationAdapter
{
  constructor(protected pickingHttpService = inject(PickingHttpService)) {}
  sendSubscription(subscription: PushSubscriptionJSON): Observable<void> {
    return this.pickingHttpService.post('/push-notification-subscriptions', {
      data: {
        type: 'push-notification-subscriptions',
        attributes: {
          providerName: 'web-push-php',
          group: {
            name: 'warehouse',
            identifier: '834b3731-02d4-5d6f-9a61-d63ae5e70517',
          },
          payload: subscription,
        }
      }
    });
  }
}