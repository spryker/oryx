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
  key: string,
  options?: IndexedDbPrimaryKeyOptions
): DecoratorContext => {
  return {
    ...context,
    kind: 'field',
    placement: 'own',
    key,
    initializer(this: TargetContext): void {
      addPrimaryKey(this, key, options);
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function indexedDbPrimaryKey(options?: IndexedDbPrimaryKeyOptions): any {
  return (
    context: DecoratorContext | TargetContext,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const propName = (options?.propPath ?? name ?? context.name) as string;
    return name !== undefined
      ? addPrimaryKey(context as TargetContext, propName, options)
      : standardIndexedDbPrimaryKey(
          context as DecoratorContext,
          propName,
          options
        );
  };
}
