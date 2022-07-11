/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, resolve } from '@spryker-oryx/injector';
import { isPromise } from '@spryker-oryx/typescript-utils';
import { from, Observable, tap } from 'rxjs';
import { SSRAwaiterService } from '../services';

export const ssrAwaiter = (
  object: Observable<any> | Promise<any>
): Observable<any> => {
  const observable = isPromise(object) ? from(object) : object;
  let ssrAwaiter: SSRAwaiterService | null = null;

  try {
    ssrAwaiter = inject(SSRAwaiterService);
  } catch (_e) {
    ssrAwaiter = resolve(SSRAwaiterService, null);
  }

  if (!ssrAwaiter) return observable;

  const resolveFn = ssrAwaiter.getAwaiter();

  return observable.pipe(
    tap({
      next: async () => {
        await 0;
        resolveFn();
      },
      error: async () => {
        await 0;
        resolveFn();
      },
      complete: async () => {
        await 0;
        resolveFn();
      },
    })
  );
};
