import { StorageService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { BapiPushNotificationService } from '@spryker-oryx/picking/offline';
import { PushService } from '@spryker-oryx/push-notification';
import { catchError, filter, Observable, of, switchMap } from 'rxjs';
import { BapiPushNotificationAdapter } from './adapter/bapi-push-notification.adapter';

export class BapiPushNotificationDefaultService
  implements BapiPushNotificationService
{
  protected readonly subscriptionFlagKey =
    'oryx.push-notification-subscription';

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
      switchMap((subscription) =>
        this.bapiPushNotificationAdapter.sendSubscription(subscription).pipe(
          // catch error when subscription already exists
          catchError((error: any) => {
            if (
              error.body.errors[0].status === 400 &&
              error.body.errors[0].code === 5003
            ) {
              return of(undefined);
            }

            this.unsubscribe();
            throw error;
          })
        )
      ),
      switchMap(() => this.storageService.set(this.subscriptionFlagKey, true))
    );
  }

  unsubscribe(): Observable<void> {
    // TODO: make unsubscribe call to API when it will be ready
    return this.pushService
      .unsubscribe()
      .pipe(
        switchMap(() => this.storageService.remove(this.subscriptionFlagKey))
      );
  }
}
