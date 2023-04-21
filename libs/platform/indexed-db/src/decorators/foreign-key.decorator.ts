import {
  DecoratorContext,
  IndexedDbForeignKey,
  IndexedDbWithPropPath,
  TargetContext,
} from '../models';
import { IndexedDbSchemaMetadata } from '../schema-metadata';

export interface IndexedDbForeignKeyOptions
  extends IndexedDbForeignKey,
    IndexedDbWithPropPath {}

function addForeignKeys(
  context: DecoratorContext | TargetContext,
  propPath: string,
  options: IndexedDbForeignKeyOptions
): void {
  if (typeof propPath === 'symbol') {
    throw new Error(
      `A ${String(propPath)} cannot be used as a foreign key in IndexedDb!`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IndexedDbSchemaMetadata.add(context.constructor as any, {
    foreignKeys: [
      {
        ...options,
        propPath,
      },
    ],
  });
}

const standardIndexedDbForeignKey = (
  context: DecoratorContext,
  propName: string,
  options: IndexedDbForeignKeyOptions
): DecoratorContext => {
  return {
    ...context,
    kind: 'field',
    initializer(this: TargetContext): void {
      //TODO: drop after review
      console.log(context, propName, options);

      addForeignKeys(this, propName, options);
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function indexedDbForeignKey(options: IndexedDbForeignKeyOptions): any {
  return (
    context: DecoratorContext | TargetContext,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const propName = (options?.propPath ?? name ?? context.key) as string;
    return name !== undefined
      ? addForeignKeys(context as TargetContext, propName, options)
      : standardIndexedDbForeignKey(
          context as DecoratorContext,
          propName,
          options
        );
  };
}
