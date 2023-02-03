import { IndexedDbForeignKey, IndexedDbWithPropPath } from '../models';
import { IndexedDbSchemaMetadata } from '../schema-metadata';

export interface IndexedDbForeignKeyOptions
  extends IndexedDbForeignKey,
    IndexedDbWithPropPath {}

export function indexedDbForeignKey(
  options: IndexedDbForeignKeyOptions
): PropertyDecorator {
  return (target, propName) => {
    const propPath = options?.propPath ?? propName;

    if (typeof propPath === 'symbol') {
      throw new Error(
        `A ${String(propPath)} cannot be used as a foreign key in IndexedDb!`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IndexedDbSchemaMetadata.add(target.constructor as any, {
      foreignKeys: [
        {
          ...options,
          propPath,
        },
      ],
    });
  };
}
