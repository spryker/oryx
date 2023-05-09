import { ClassContext, TargetContext } from '@spryker-oryx/utilities';
import { IndexedDbEntity } from '../models';
import {
  IndexedDbIndexMetadata,
  IndexedDbSchemaMetadata,
} from '../schema-metadata';

export function addEntity(
  target: TargetContext,
  options?: IndexedDbEntity
): void {
  const indexes = options?.indexes?.map(
    (index) =>
      ({
        ...index,
        // Set version data to same as entity version
        version: options.version,
        unset: options.unset,
      } as IndexedDbIndexMetadata)
  );

  IndexedDbSchemaMetadata.add(target, {
    ...options,
    indexes,
  });
}

/* c8 ignore start */
const standardIndexedDbEntity = (
  context: ClassContext,
  options?: IndexedDbEntity
): ClassContext => {
  return {
    ...context,
    finisher(clazz) {
      addEntity(clazz, options);
    },
  };
};
/* c8 ignore end */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function indexedDbEntity(options?: IndexedDbEntity): any {
  return (context: ClassContext | TargetContext): ClassContext | void =>
    typeof context === 'function'
      ? addEntity(context, options)
      : standardIndexedDbEntity(context as ClassContext, options);
}
