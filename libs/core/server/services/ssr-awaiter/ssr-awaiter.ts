/* eslint-disable @typescript-eslint/no-explicit-any */
import { SSRAwaiterService } from '@spryker-oryx/core';
import { inject, resolve } from '@spryker-oryx/injector';
import { Observable, tap } from 'rxjs';

export const ssrAwaiter = (observable: Observable<any>): Observable<any> => {
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
      next: () => resolveFn(),
      error: () => resolveFn(),
      complete: () => resolveFn(),
    })
  );
};
