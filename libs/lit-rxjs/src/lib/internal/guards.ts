/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';

export function isObservable<T = any>(object: any): object is Observable<T> {
  return typeof object?.subscribe === 'function';
}

export function isPromise<T = any>(object: any): object is Promise<T> {
  return typeof object?.then === 'function';
}
