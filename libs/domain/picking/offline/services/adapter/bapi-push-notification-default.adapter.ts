import { inject } from '@spryker-oryx/di';
import { PickingHttpService } from '@spryker-oryx/picking';
import { Observable } from 'rxjs';
import { BapiPushNotificationAdapter } from './bapi-push-notification.adapter';

export class BapiPushNotificationDefaultAdapter
  implements BapiPushNotificationAdapter
{
  constructor(protected pickingHttpService = inject(PickingHttpService)) {}
  sendSubscription(subscription: PushSubscriptionJSON): Observable<void> {
    return this.pickingHttpService.post('/push-notification-subscription', {
      providerName: 'web-push-php',
      group: {
        name: 'warehouse',
        identifier: 1234,
      },
      payload: subscription,
    });
  }
}
