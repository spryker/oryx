export type PromiseResolveFn<T> = (value: T | PromiseLike<T>) => void;
export type PromiseRejectFn = (reason?: unknown) => void;
export type PromiseExecutorFn<T> = (
  resolve: PromiseResolveFn<T>,
  reject: PromiseRejectFn
) => void;

export class PromiseSubject<T> extends Promise<T> {
  private _resolve!: PromiseResolveFn<T>;
  private _reject!: PromiseRejectFn;

  constructor(executor?: PromiseExecutorFn<T>) {
    let resolve: PromiseResolveFn<T>;
    let reject: PromiseRejectFn;

    super((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
      executor?.(resolve, reject);
    });

    // Executor is running synchronously so functions resolve immediately
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    this._resolve = resolve!;
    this._reject = reject!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  }

  resolve(value: T | PromiseLike<T>): void {
    this._resolve(value);
  }

  reject(reason?: unknown): void {
    this._reject(reason);
  }

  asPromise(): Promise<T> {
    return new Promise((res, rej) => this.then(res).catch(rej));
  }
}
