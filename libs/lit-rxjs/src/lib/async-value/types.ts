import { Observable, Subscription } from 'rxjs';

export interface Type<T> extends AbstractType<T> {
  new (...args: any[]): T;
}

export interface AbstractType<T> {
  prototype: T;
}

export function isPromise<T = any>(object: any): object is Promise<T> {
  return typeof object?.then === 'function';
}

export function isObservable<T = any>(object: any): object is Observable<T> {
  return typeof object?.subscribe === 'function';
}

export interface AsyncValueStrategy {
  createSubscription<T = unknown>(
    async: Observable<T> | Promise<T>,
    update: (value: T) => unknown
  ): Subscription | Promise<unknown>;

  dispose(subscription: Subscription | Promise<unknown>): void;
}
