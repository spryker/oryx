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

  getSubscription(): Observable<PushSubscriptionJSON> {
    return this.getExistingSubscription().pipe(
      switchMap((subscription) =>
        subscription ? of(subscription) : this.createSubscription()
      ),
      map((subscription) => subscription.toJSON())
    );
  }

  deleteSubscription(): Observable<boolean> {
    return this.getExistingSubscription().pipe(
      switchMap((subscription) => subscription?.unsubscribe() ?? of(true))
    );
  }

  protected createSubscription(): Observable<PushSubscription> {
    const userVisibleOnly = this.options?.userVisibleOnly ?? true;
    const applicationServerKey = this.options?.applicationServerKey
      ? this.encodeKey(this.options.applicationServerKey)
      : undefined;

    return this.pushManager$.pipe(
      switchMap((pushManager) =>
        pushManager.subscribe({
          userVisibleOnly,
          applicationServerKey,
        })
      )
    );
  }

  protected getExistingSubscription(): Observable<PushSubscription | null> {
    return this.pushManager$.pipe(
      switchMap((pushManager) => pushManager.getSubscription())
    );
  }

  /**
   * The key should be URL-safe base64 encoded without padding (no trailing =)
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PushManager/subscribe#parameters
   */
  protected encodeKey(key: string): string {
    return encodeURIComponent(key.replace(/([^=].)=+$/, '$1'));
  }
}
