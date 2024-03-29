import { OauthService } from '@spryker-oryx/auth';
import { ExecPlugin, InjectionPlugin } from '@spryker-oryx/core';
import { WarehouseUserAssignmentsService } from '@spryker-oryx/picking/services';
import { BapiPushNotificationService } from './services';

export class PushNotificationPlugin extends ExecPlugin {
  constructor() {
    super((app) => {
      const injector = app!.requirePlugin(InjectionPlugin).getInjector();

      const authService = injector.inject(OauthService);
      const pushNotificationService = injector.inject(
        BapiPushNotificationService
      );
      const isUserAssigned = injector.inject(WarehouseUserAssignmentsService);

      isUserAssigned.getUserAssignment().subscribe((userAssignment) => {
        if (userAssignment) {
          pushNotificationService.initSubscription().subscribe();
        }
      });

      authService.isAuthenticated().subscribe((isAuthenticated) => {
        if (!isAuthenticated) {
          pushNotificationService.unsubscribe().subscribe();
        }
      });
    });
  }
}
