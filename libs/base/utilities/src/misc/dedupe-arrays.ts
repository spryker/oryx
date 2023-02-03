import { IdentityFn } from '../model';

export function dedupeArrays<T>(...arrays: T[][]): T[];
export function dedupeArrays<T>(
  identityFn: IdentityFn<T>,
  ...arrays: T[][]
): T[];
export function dedupeArrays<T>(
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

  const uniqueArray: T[] = [];
  const existingIdSet = new Set<unknown>();

  for (const array of arrays) {
    for (const item of array) {
      const id = identityFn(item);

      if (existingIdSet.has(id)) {
        continue;
      }

      existingIdSet.add(id);
      uniqueArray.push(item);
    }
  }

  return uniqueArray;
}
