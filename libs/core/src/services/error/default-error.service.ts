import { inject } from '@spryker-oryx/injector';
import { ErrorHandler } from './error-handler';
import { ErrorService } from './error.service';

export class DefaultErrorService implements ErrorService {
  constructor(
    protected element: EventTarget = window,
    protected handler = inject(ErrorHandler, null)
  ) {}

  initialize(): void {
    if (!this.handler) {
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
    this.handler?.handle(event);
  };
}
