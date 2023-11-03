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

  if (typeof arr1OrIdentityFn !== 'function')
    arrays = [arr1OrIdentityFn, ...arrays];

  const [firstArray, ...restArrays] = arrays;

  const intersectionArray = firstArray.filter((value) => {
    const firstItemId = identityFn(value);
    return restArrays.every((array) =>
      array.some((item) => firstItemId === identityFn(item))
    );
  });

  return intersectionArray;
}
