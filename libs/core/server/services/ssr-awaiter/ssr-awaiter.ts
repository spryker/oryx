/* eslint-disable @typescript-eslint/no-explicit-any */
import { CoreServices, SSRAwaiterContract } from '@spryker-oryx/core';
import { inject, resolve } from '@spryker-oryx/injector';
import { defer, Observable, of, tap } from 'rxjs';

export const ssrAwaiter = (
  observable: Observable<any> | undefined,
  context?: any
): Observable<any> => {
  let ssrAwaiter: SSRAwaiterContract | null = null;

  if (!context) {
    ssrAwaiter = inject(CoreServices.SSRAwaiter);
  }

  return defer(() => {
    if (context) {
      ssrAwaiter = resolve(context, CoreServices.SSRAwaiter, null);
    }

    const resolveFn = ssrAwaiter?.getAwaiter();

    return observable?.pipe(tap(resolveFn)) || of({});
  });
};
