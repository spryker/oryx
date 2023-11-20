import { StorageService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { PushService } from '@spryker-oryx/push-notification';
import {
  catchError,
  defer,
  filter,
  from,
  Observable,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { BapiPushNotificationAdapter } from './adapter';
import { BapiPushNotificationService } from './bapi-push-notification.service';

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
    return this.precondition().pipe(
      switchMap(() =>
        this.storageService.get<boolean>(this.subscriptionFlagKey)
      ),
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

            return this.unsubscribe().pipe(
              switchMap(() => throwError(() => error))
            );
          })
        )
      ),
      switchMap(() => this.storageService.set(this.subscriptionFlagKey, true))
    );
  }

  unsubscribe(): Observable<void> {
    return this.pushService
      .unsubscribe()
      .pipe(
        switchMap(() => this.storageService.remove(this.subscriptionFlagKey))
      );
  }

  protected async checkSupportAndPermission(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Browser does not support service-worker API');
    }

    if (!('SyncManager' in window)) {
      throw new Error('Browser does not support background sync API');
    }

    if (await this.permissionDenied('notifications')) {
      throw new Error(
        'Permission to accept push notifications is not granted. Check the browser configuration or reset the permission'
      );
    }

    if (await this.permissionDenied('background-sync')) {
      throw new Error(
        'Permission to perform background sync is not granted. Check the browser configuration or reset the permission'
      );
    }
  }

  protected precondition(): Observable<void> {
    return defer(() => from(this.checkSupportAndPermission())).pipe(take(1));
  }

  protected async permissionDenied(name: string): Promise<boolean> {
    return (
      (await navigator.permissions.query({ name: name as PermissionName }))
        ?.state === 'denied'
    );
  }
}
