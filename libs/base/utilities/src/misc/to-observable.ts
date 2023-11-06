import { from, isObservable, Observable, of } from 'rxjs';

/**
 * Convert plain value, promise or observable to observable.
 */
export function toObservable<T>(
  value: T | Promise<T> | Observable<T>
): Observable<T> {
  if (isObservable(value)) {
    return value;
  }

  if (value instanceof Promise) {
    return from(value);
  }

  return of(value);
}
