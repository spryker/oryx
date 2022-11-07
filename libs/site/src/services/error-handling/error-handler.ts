import { ErrorHandler } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { Types } from '@spryker-oryx/ui/notification';
import { NotificationService } from '../notification';

export class SiteErrorHandler implements ErrorHandler {
  constructor(protected notificationService = inject(NotificationService)) {}

  handle(event: ErrorEvent | PromiseRejectionEvent): void {
    const message =
      ((event as ErrorEvent).error?.message ?? '') +
        ((event as ErrorEvent).message ?? '') +
        ((event as PromiseRejectionEvent).reason ?? '') || '';

    this.notificationService.push({
      type: Types.ERROR,
      content: 'Error',
      subtext: message,
    });
  }
}
