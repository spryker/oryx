import { FieldOrMethodContext, TargetContext } from '@spryker-oryx/utilities';
import { IndexedDbPrimaryKey, IndexedDbWithPropPath } from '../models';
import { IndexedDbSchemaMetadata } from '../schema-metadata';

export interface IndexedDbPrimaryKeyOptions
  extends IndexedDbPrimaryKey,
    IndexedDbWithPropPath {}

function addPrimaryKey(
  target: TargetContext,
  propPath: string,
  options?: IndexedDbPrimaryKeyOptions
): void {
  if (typeof propPath === 'symbol') {
    throw new Error(
      `A ${String(propPath)} cannot be a primary key in IndexedDb!`
    );
  }

  IndexedDbSchemaMetadata.add(target, {
    primaryKey: {
      ...options,
      propPath,
    },
  });
}

/* c8 ignore start */
const standardIndexedDbPrimaryKey = (
  context: FieldOrMethodContext,
  propName: string,
  options?: IndexedDbPrimaryKeyOptions
): FieldOrMethodContext => {
  return {
    ...context,
    finisher(clazz) {
      addPrimaryKey(clazz, propName, options);
    },
  };
};
/* c8 ignore end */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function indexedDbPrimaryKey(options?: IndexedDbPrimaryKeyOptions): any {
  return (
    context: FieldOrMethodContext | TargetContext,
    name?: PropertyKey
  ): FieldOrMethodContext | void => {
    const propName = (options?.propPath ?? name ?? context.key) as string;
    return name !== undefined
      ? addPrimaryKey(context.constructor as TargetContext, propName, options)
      : standardIndexedDbPrimaryKey(
          context as FieldOrMethodContext,
          propName,
          options
        );
  };
}
