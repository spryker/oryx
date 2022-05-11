import { SSRAwaiterService } from '@spryker-oryx/core';

export class DefaultSSRAwaiterService implements SSRAwaiterService {
  protected awaiters: Promise<unknown>[] = [];

  getAwaiter(): () => void {
    let resolve: (value: unknown) => void;
    const awaiter = new Promise((_resolve) => {
      resolve = _resolve;
    });
    this.awaiters.push(awaiter);

    return (): void => {
      resolve(undefined);
    };
  }

  hasAwaiter(): boolean {
    return this.awaiters.length !== 0;
  }

  await(): Promise<unknown> {
    const promise = Promise.all(this.awaiters);
    this.awaiters = [];

    return promise;
  }
}
