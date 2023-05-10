import { StorageService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { BapiPushNotificationService } from '@spryker-oryx/picking/offline';
import { PushService } from '@spryker-oryx/push-notification';
import { filter, map, Observable, switchMap } from 'rxjs';
import { BapiPushNotificationAdapter } from './adapter/bapi-push-notification.adapter';

export class BapiPushNotificationDefaultService
  implements BapiPushNotificationService
{
  private readonly subscriptionFlagKey = 'pushSubscriptionFlag';

  constructor(
    private pushService: PushService = inject(PushService),
    private bapiPushNotificationAdapter: BapiPushNotificationAdapter = inject(
      BapiPushNotificationAdapter
    ),
    private storageService: StorageService = inject(StorageService)
  ) {}

  initSubscription(): Observable<void> {
    return this.storageService.get<boolean>(this.subscriptionFlagKey).pipe(
      filter((isSubscribed) => !isSubscribed),
      switchMap(() => this.pushService.subscribe()),
      map((subscription) => subscription as PushSubscriptionJSON),
      switchMap((subscription: PushSubscriptionJSON) =>
        this.bapiPushNotificationAdapter.sendSubscription(subscription)
      ),
      switchMap(() => this.storageService.set(this.subscriptionFlagKey, true))
    );
  }
}
