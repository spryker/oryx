import {
  DecoratorContext,
  IndexedDbPrimaryKey,
  IndexedDbWithPropPath,
  TargetContext,
} from '../models';
import { IndexedDbSchemaMetadata } from '../schema-metadata';

export interface IndexedDbPrimaryKeyOptions
  extends IndexedDbPrimaryKey,
    IndexedDbWithPropPath {}

function addPrimaryKey(
  context: DecoratorContext | TargetContext,
  propPath: string,
  options?: IndexedDbPrimaryKeyOptions
): void {
  if (typeof propPath === 'symbol') {
    throw new Error(
      `A ${String(propPath)} cannot be a primary key in IndexedDb!`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IndexedDbSchemaMetadata.add(context.constructor as any, {
    primaryKey: {
      ...options,
      propPath,
    },
  });
}

const standardIndexedDbPrimaryKey = (
  context: DecoratorContext,
  propName: string,
  options?: IndexedDbPrimaryKeyOptions
): DecoratorContext => {
  return {
    ...context,
    kind: 'field',
    initializer(this: TargetContext): void {
      //TODO: drop after review
      console.log(context, propName, options);
      addPrimaryKey(this, propName, options);
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function indexedDbPrimaryKey(options?: IndexedDbPrimaryKeyOptions): any {
  return (
    context: DecoratorContext | TargetContext,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const propName = (options?.propPath ?? name ?? context.key) as string;
    return name !== undefined
      ? addPrimaryKey(context as TargetContext, propName, options)
      : standardIndexedDbPrimaryKey(
          context as DecoratorContext,
          propName,
          options
        );
  };
}
