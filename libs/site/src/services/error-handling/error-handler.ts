import { ErrorHandler } from '@spryker-oryx/core';

export class SiteErrorHandler implements ErrorHandler {
  handle(event: ErrorEvent | PromiseRejectionEvent): void {
    console.log('handle error', event);
  }
}
