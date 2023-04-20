import { ClassContext, IndexedDbEntity } from '../models';
import {
  IndexedDbIndexMetadata,
  IndexedDbSchemaMetadata,
} from '../schema-metadata';

export function addEntity(context: any, options?: IndexedDbEntity): void {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const indexes = options?.indexes?.map(
    (index) =>
      ({
        ...index,
        // Set version data to same as entity version
        version: options.version,
        unset: options.unset,
      } as IndexedDbIndexMetadata)
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IndexedDbSchemaMetadata.add(context as any, {
    ...options,
    indexes,
  });
}

const standardIndexedDbEntity = (
  context: ClassContext,
  options: IndexedDbEntity
): ClassContext => ({
  ...context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  finisher: (clazz: any) => addEntity(clazz, options),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function indexedDbEntity(options: IndexedDbEntity): any {
  return (context: any): ClassContext | void =>
    typeof context === 'function'
      ? addEntity(context, options)
      : standardIndexedDbEntity(context, options);
}
