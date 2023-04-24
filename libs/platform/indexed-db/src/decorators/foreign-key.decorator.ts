import { FieldOrMethodContext, TargetContext } from '@spryker-oryx/utilities';
import { IndexedDbForeignKey, IndexedDbWithPropPath } from '../models';
import { IndexedDbSchemaMetadata } from '../schema-metadata';

export interface IndexedDbForeignKeyOptions
  extends IndexedDbForeignKey,
    IndexedDbWithPropPath {}

function addForeignKeys(
  target: TargetContext,
  propPath: string,
  options: IndexedDbForeignKeyOptions
): void {
  if (typeof propPath === 'symbol') {
    throw new Error(
      `A ${String(propPath)} cannot be used as a foreign key in IndexedDb!`
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IndexedDbSchemaMetadata.add(target, {
    foreignKeys: [
      {
        ...options,
        propPath,
      },
    ],
  });
}

const standardIndexedDbForeignKey = (
  context: FieldOrMethodContext,
  propName: string,
  options: IndexedDbForeignKeyOptions
): FieldOrMethodContext => {
  return {
    ...context,
    finisher(clazz) {
      addForeignKeys(clazz, propName, options);
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function indexedDbForeignKey(options: IndexedDbForeignKeyOptions): any {
  return (
    context: FieldOrMethodContext | TargetContext,
    name?: PropertyKey
  ): FieldOrMethodContext | void => {
    const propName = (options?.propPath ?? name ?? context.key) as string;
    return name !== undefined
      ? addForeignKeys(context.constructor as TargetContext, propName, options)
      : standardIndexedDbForeignKey(
          context as FieldOrMethodContext,
          propName,
          options
        );
  };
}
