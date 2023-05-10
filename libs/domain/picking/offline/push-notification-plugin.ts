import { OauthService } from '@spryker-oryx/auth';
import { ExecPlugin, InjectionPlugin } from '@spryker-oryx/core';
import { first } from 'rxjs';
import { BapiPushNotificationService } from './services';

export class PushNotificationPlugin extends ExecPlugin {
  constructor() {
    super((app) => {
      const injector = app!.requirePlugin(InjectionPlugin).getInjector();

      const authService = injector.inject(OauthService);
      const pushNotificationService = injector.inject(
        BapiPushNotificationService
      );

      console.log('PushNotificationPlugin');
      authService
        .isAuthenticated()
        .pipe(first())
        .subscribe((isAuthenticated) => {
          console.log('isAuthenticated', isAuthenticated);
          if (isAuthenticated) {
            pushNotificationService.initSubscription().subscribe(() => {
              console.log('Push notifications subscribed');
            });
          } else {
            // this.pushNotificationService.unsubscribe().subscribe(() => {
            //   console.log('Unsubscribed from push notifications');
            // });
          }
        });
    });
  }
}
