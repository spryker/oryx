import { Observable, Subscription } from 'rxjs';

export function isObservable<T = any>(object: any): object is Observable<T> {
  return typeof object?.subscribe === 'function';
}

export function isPromise<T = any>(object: any): object is Promise<T> {
  return typeof object?.then === 'function';
}

export interface AsyncValueStrategy {
  createSubscription<T = unknown>(
    async: Observable<T> | Promise<T>,
    update: (value: T) => unknown
  ): Subscription | Promise<unknown>;

  dispose(subscription: Subscription | Promise<unknown>): void;
}
