import { ErrorHandler } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { AlertType } from '@spryker-oryx/ui';
import { NotificationService } from '../notification';

interface ApiError {
  code: string;
  detail: string;
  status: number;
}

export class SiteErrorHandler implements ErrorHandler {
  constructor(protected notificationService = inject(NotificationService)) {}

  handle(error: unknown): void {
    let message;

    if (this.isErrorObject(error))
      message = this.getMessage(error?.body) || error?.message;

    this.notificationService.push({
      type: AlertType.Error,
      content: 'Error',
      subtext: message || String(error),
    });
  }

  protected getMessage(body: unknown): string {
    return this.isApiError(body)
      ? `${body.errors[0].status} ${body.errors[0].detail}`
      : '';
  }

  protected isErrorObject(
    error: unknown
  ): error is { message?: any; body?: any } {
    return typeof error === 'object';
  }

  protected isApiError(body: any): body is { errors: ApiError[] } {
    return (
      typeof body === 'object' &&
      body?.errors !== undefined &&
      Array.isArray(body?.errors)
    );
  }
}
