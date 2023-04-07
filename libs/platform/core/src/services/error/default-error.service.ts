import { inject } from '@spryker-oryx/di';
import { isServer } from 'lit';
import { ErrorHandler } from './error-handler';
import { ErrorService } from './error.service';

export class DefaultErrorService implements ErrorService {
  constructor(
    protected element: EventTarget = globalThis,
    protected handler = inject(ErrorHandler, null)
  ) {}

  initialize(): void {
    if (!this.handler || isServer) {
      return;
    }

    this.element.addEventListener('error', this.handle as EventListener);
    this.element.addEventListener(
      'unhandledrejection',
      this.handle as EventListener
    );
  }

  onDestroy(): void {
    if (!this.handler) {
      return;
    }

    this.element.removeEventListener('error', this.handle as EventListener);
    this.element.removeEventListener(
      'unhandledrejection',
      this.handle as EventListener
    );
  }

  dispatchError(event: ErrorEvent | PromiseRejectionEvent): void {
    this.element.dispatchEvent(event);
  }

  protected handle = (event: ErrorEvent | PromiseRejectionEvent): void => {
    const error =
      event instanceof PromiseRejectionEvent
        ? event.reason
        : event.error || event.message;

    // Check is done when this listener is attached
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.handler!.handle(error);
  };
}
