import { ErrorHandler } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Types } from '@spryker-oryx/ui/notification';
import { NotificationService } from '../notification';

export class SiteErrorHandler implements ErrorHandler {
  constructor(protected notificationService = inject(NotificationService)) {}

  handle(error: unknown): void {
    const message =
      (typeof error === 'object' && (error as any)?.message) ?? String(error);

    this.notificationService.push({
      type: Types.ERROR,
      content: 'Error',
      subtext: message,
    });
  }
}
