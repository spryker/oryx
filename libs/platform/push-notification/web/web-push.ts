import { PushProvider } from '@spryker-oryx/push-notification';
import { from, map, Observable, of, switchMap } from 'rxjs';

export interface WebPushProviderOptions {
  /**
   * Base64 encoded public VAPID Web Push key
   *
   * A keypair can be generated at https://vapidkeys.com/
   */
  applicationServerKey?: string;
  /**
   * Indicate if push message will always trigger visible notifications.
   *
   * By default it is set to `true` because Chrome requires it.
   * @default true
   * @see https://docs.google.com/document/d/13VxFdLJbMwxHrvnpDm8RXnU41W2ZlcP0mdWWe9zXQT8/edit
   */
  userVisibleOnly?: boolean;
}

export class WebPushProvider implements PushProvider<PushSubscriptionJSON> {
  protected pushManager$ = from(navigator.serviceWorker.ready).pipe(
    map((serviceWorker) => serviceWorker.pushManager)
  );

  constructor(protected options?: WebPushProviderOptions) {}

  init(): Observable<void> {
    return of(undefined);
  }

  protected async checkSupportAndPermission(): Promise<void> {
    let error = '';

    if (!('serviceWorker' in navigator)) {
      error = 'Browser does not support service-worker API';
    } else if (!('SyncManager' in window)) {
      error = 'Browser does not support background sync API';
    } else if (
      (await navigator.permissions.query({ name: 'notifications' })).state ===
      'denied'
    ) {
      error =
        'Permission to accept push notifications is not granted. Check the browser configuration or reset the permission';
    } else if (
      (
        await navigator.permissions.query({
          name: 'background-sync' as PermissionName,
        })
      ).state === 'denied'
    ) {
      error =
        'Permission to perform background sync is not granted. Check the browser configuration or reset the permission';
    }

    if (error) throw new Error(error);
  }

  getSubscription(): Observable<PushSubscriptionJSON> {
    return from(this.checkSupportAndPermission()).pipe(
      switchMap(() =>
        this.getExistingSubscription().pipe(
          switchMap((subscription) =>
            subscription ? of(subscription) : this.createSubscription()
          ),
          map((subscription) => subscription.toJSON())
        )
      )
    );
  }

  deleteSubscription(): Observable<boolean> {
    return this.getExistingSubscription().pipe(
      switchMap((subscription) => subscription?.unsubscribe() ?? of(true))
    );
  }

  getPermissionState(): Observable<PermissionState> {
    return this.pushManager$.pipe(
      switchMap((pushManager) => pushManager.permissionState(this.getOptions()))
    );
  }

  protected createSubscription(): Observable<PushSubscription> {
    return this.pushManager$.pipe(
      switchMap((pushManager) => pushManager.subscribe(this.getOptions()))
    );
  }

  protected getExistingSubscription(): Observable<PushSubscription | null> {
    return this.pushManager$.pipe(
      switchMap((pushManager) => pushManager.getSubscription())
    );
  }

  protected getOptions(): Partial<WebPushProviderOptions> {
    return {
      userVisibleOnly: this.options?.userVisibleOnly ?? true,
      applicationServerKey: this.options?.applicationServerKey
        ? this.encodeKey(this.options.applicationServerKey)
        : undefined,
    };
  }

  /**
   * The key should be URL-safe base64 encoded without padding (no trailing =)
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PushManager/subscribe#parameters
   */
  protected encodeKey(key: string): string {
    return encodeURIComponent(key.replace(/([^=].)=+$/, '$1'));
  }
}
