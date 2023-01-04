import { AsyncValueStrategy } from './async-value.model';

export class AsyncValuePromiseStrategy implements AsyncValueStrategy {
  createSubscription<T = unknown>(
    async: Promise<T>,
    update: (value: T) => unknown
  ): Promise<unknown> {
    return async.then(update).catch((error: Error) => {
      throw error;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  dispose(subscription: Promise<unknown>): void {}
}
