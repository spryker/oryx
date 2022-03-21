// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPromise<T = any>(object: any): object is Promise<T> {
  return typeof object?.then === 'function';
}
