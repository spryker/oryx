import { Observable, Subscription } from 'rxjs';
import { AsyncValueStrategy } from './async-value.model';
export class AsyncValueObservableStrategy implements AsyncValueStrategy {
  createSubscription<T = unknown>(
    async: Observable<T>,
    update: (value: T) => unknown
  ): Subscription {
    return async.subscribe({
      next: update,
      error: (error: Error) => {
        throw error;
      },
    });
  }

  dispose(subscription: Subscription): void {
    subscription?.unsubscribe();
  }
}
