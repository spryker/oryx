import { IdentityFn } from '../model';

export function intersectArrays<T>(...arrays: T[][]): T[];
export function intersectArrays<T>(
  identityFn: IdentityFn<T>,
  ...arrays: T[][]
): T[];
export function intersectArrays<T>(
  arr1OrIdentityFn: T[] | IdentityFn<T>,
  ...arrays: T[][]
): T[] {
  const identityFn: IdentityFn<T> =
    typeof arr1OrIdentityFn === 'function'
      ? arr1OrIdentityFn
      : // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        (v1) => v1;

  if (typeof arr1OrIdentityFn !== 'function') {
    arrays = [arr1OrIdentityFn, ...arrays];
  }

  const intersectingMap = new Map<unknown, T>();

  for (const array of arrays) {
    for (const item of array) {
      const id = identityFn(item);

      if (!intersectingMap.has(id)) {
        intersectingMap.set(id, item);
      }
    }
  }

  return Array.from(intersectingMap.values());
}
