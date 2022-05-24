/* eslint-disable @typescript-eslint/no-explicit-any */
import { SSRAwaiterService } from '@spryker-oryx/core';
import { inject, resolve } from '@spryker-oryx/injector';
import { defer, Observable, of, tap } from 'rxjs';

export const ssrAwaiter = (
  observable: Observable<any> | undefined,
  context?: any
): Observable<any> => {
  let ssrAwaiter: SSRAwaiterService | null = null;

  if (!context) {
    ssrAwaiter = inject(SSRAwaiterService);
  }

  return defer(() => {
    if (context) {
      ssrAwaiter = resolve(context, SSRAwaiterService, null);
    }

    const resolveFn = ssrAwaiter?.getAwaiter();

    return (
      observable?.pipe(
        tap({
          next: () => resolveFn?.(),
          error: () => resolveFn?.(),
          complete: () => resolveFn?.(),
        })
      ) || of({})
    );
  });
};
