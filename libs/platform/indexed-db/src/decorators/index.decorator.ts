import {
  IndexedDbIndex,
  IndexedDbVersioned,
  IndexedDbWithPropPath,
} from '../models';
import { IndexedDbSchemaMetadata } from '../schema-metadata';

export type IndexedDbIndexOptions =
  | IndexedDbWithPropPath
  | (IndexedDbVersioned & IndexedDbWithPropPath)
  | (IndexedDbIndex & IndexedDbWithPropPath);

export function indexedDbIndex(
  options?: IndexedDbIndexOptions
): PropertyDecorator {
  return (target, propName) => {
    const propPath = options?.propPath ?? propName;

    if (typeof propPath === 'symbol') {
      throw new Error(`A ${String(propPath)} cannot be an index in IndexedDb!`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IndexedDbSchemaMetadata.add(target.constructor as any, {
      indexes: [
        {
          ...options,
          propPath,
        },
      ],
    });
  };
}
