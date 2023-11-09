import { inject } from '@spryker-oryx/di';
import {
  PickingHttpService,
  WarehouseUserAssignmentsService,
} from '@spryker-oryx/picking/api';
import { Observable, switchMap } from 'rxjs';
import { BapiPushNotificationAdapter } from './bapi-push-notification.adapter';

export class BapiPushNotificationDefaultAdapter
  implements BapiPushNotificationAdapter
{
  constructor(
    protected pickingHttpService = inject(PickingHttpService),
    protected warehouseUserAssignmentsService = inject(
      WarehouseUserAssignmentsService
    )
  ) {}
  sendSubscription(subscription: PushSubscriptionJSON): Observable<void> {
    return this.warehouseUserAssignmentsService.getUserAssignment().pipe(
      switchMap((userAssignment) => {
        if (!userAssignment?.warehouse.uuid) {
          throw new Error('No warehouse user assignment found!');
        }

        return this.pickingHttpService.post(
          '/push-notification-subscriptions',
          {
            data: {
              type: 'push-notification-subscriptions',
              attributes: {
                providerName: 'web-push-php',
                group: {
                  name: 'warehouse',
                  identifier: userAssignment.warehouse.uuid,
                },
                payload: subscription,
              },
            },
          }
        );
      })
    ) as Observable<void>;
  }
}
