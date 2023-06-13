import { OauthService } from '@spryker-oryx/auth';
import { ExecPlugin, InjectionPlugin } from '@spryker-oryx/core';
import { BapiPushNotificationService } from './services';

export class PushNotificationPlugin extends ExecPlugin {
  constructor() {
    super((app) => {
      const injector = app!.requirePlugin(InjectionPlugin).getInjector();

      const authService = injector.inject(OauthService);
      const pushNotificationService = injector.inject(
        BapiPushNotificationService
      );

      authService.isAuthenticated().subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          pushNotificationService.initSubscription().subscribe();
        } else {
          pushNotificationService.unsubscribe().subscribe();
        }
      });
    });
  }
}
