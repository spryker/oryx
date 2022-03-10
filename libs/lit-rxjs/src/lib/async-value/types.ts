import { Observable, Subscription } from 'rxjs';

export interface AsyncValueStrategy {
  createSubscription<T = unknown>(
    async: Observable<T> | Promise<T>,
    update: (value: T) => unknown
  ): Subscription | Promise<unknown>;

  dispose(subscription: Subscription | Promise<unknown>): void;
}
