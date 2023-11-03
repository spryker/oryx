import { FieldOrMethodContext, TargetContext } from '@spryker-oryx/utilities';
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

function addIndexes(
  target: TargetContext,
  propPath: string,
  options?: IndexedDbIndexOptions
): void {
  if (typeof propPath === 'symbol')
    throw new Error(`A ${String(propPath)} cannot be an index in IndexedDb!`);

  IndexedDbSchemaMetadata.add(target, {
    indexes: [
      {
        ...options,
        propPath,
      },
    ],
  });
}

/* c8 ignore start */
const standardIndexedDbIndex = (
  context: FieldOrMethodContext,
  propName: string,
  options?: IndexedDbIndexOptions
): FieldOrMethodContext => {
  return {
    ...context,
    finisher(clazz): void {
      addIndexes(clazz, propName, options);
    },
  };
};
/* c8 ignore end */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function indexedDbIndex(options?: IndexedDbIndexOptions): any {
  return (
    context: FieldOrMethodContext | TargetContext,
    name?: PropertyKey
  ): FieldOrMethodContext | void => {
    const propName = (options?.propPath ?? name ?? context.key) as string;
    return name !== undefined
      ? addIndexes(context.constructor as TargetContext, propName, options)
      : standardIndexedDbIndex(
          context as FieldOrMethodContext,
          propName,
          options
        );
  };
}
