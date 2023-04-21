import {
  DecoratorContext,
  IndexedDbIndex,
  IndexedDbVersioned,
  IndexedDbWithPropPath,
  TargetContext,
} from '../models';
import { IndexedDbSchemaMetadata } from '../schema-metadata';

export type IndexedDbIndexOptions =
  | IndexedDbWithPropPath
  | (IndexedDbVersioned & IndexedDbWithPropPath)
  | (IndexedDbIndex & IndexedDbWithPropPath);

function addIndexes(
  context: DecoratorContext | TargetContext,
  propPath: string,
  options?: IndexedDbIndexOptions
): void {
  if (typeof propPath === 'symbol') {
    throw new Error(`A ${String(propPath)} cannot be an index in IndexedDb!`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IndexedDbSchemaMetadata.add(context.constructor as any, {
    indexes: [
      {
        ...options,
        propPath,
      },
    ],
  });
}

const standardIndexedDbIndex = (
  context: DecoratorContext,
  propName: string,
  options?: IndexedDbIndexOptions
): DecoratorContext => {
  return {
    ...context,
    kind: 'field',
    initializer(this: TargetContext): void {
      //TODO: drop after review
      console.log(context, propName, options);

      addIndexes(this, propName, options);
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function indexedDbIndex(options?: IndexedDbIndexOptions): any {
  return (
    context: DecoratorContext | TargetContext,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const propName = (options?.propPath ?? name ?? context.key) as string;
    return name !== undefined
      ? addIndexes(context as TargetContext, propName, options)
      : standardIndexedDbIndex(context as DecoratorContext, propName, options);
  };
}
