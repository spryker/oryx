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

  const intersectionArray: T[] = [];
  const [firstArray, ...restArrays] = arrays;

  firstArray.filter((value) => {
    const firstItemId = identityFn(value);
    let itemNotFound = false;
    restArrays.map((array) => {
      let intersectedItem = false;

      array.map((item) => {
        const anotherItemId = identityFn(item);

        if (firstItemId === anotherItemId) {
          intersectedItem = firstItemId === anotherItemId;
        }
      });

      if (!intersectedItem) {
        itemNotFound = true;
      }
    });

    if (!itemNotFound) {
      intersectionArray.push(value);
    }
  });

  return intersectionArray;
}
