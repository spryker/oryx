import { IndexedDbPrimaryKey, IndexedDbWithPropPath } from '../models';
import { IndexedDbSchemaMetadata } from '../schema-metadata';

export interface IndexedDbPrimaryKeyOptions
  extends IndexedDbPrimaryKey,
    IndexedDbWithPropPath {}

export function indexedDbPrimaryKey(
  options?: IndexedDbPrimaryKeyOptions
): PropertyDecorator {
  return (target, propName) => {
    const propPath = options?.propPath ?? propName;

    if (typeof propPath === 'symbol') {
      throw new Error(
        `A ${String(propPath)} cannot be a primary key in IndexedDb!`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IndexedDbSchemaMetadata.add(target.constructor as any, {
      primaryKey: {
        ...options,
        propPath,
      },
    });
  };
}
