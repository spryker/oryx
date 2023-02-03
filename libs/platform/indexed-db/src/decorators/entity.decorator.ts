import { IndexedDbEntity } from '../models';
import {
  IndexedDbIndexMetadata,
  IndexedDbSchemaMetadata,
} from '../schema-metadata';

export function indexedDbEntity(options?: IndexedDbEntity): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return <TFunction extends Function>(target: TFunction) => {
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
    IndexedDbSchemaMetadata.add(target as any, {
      ...options,
      indexes,
    });
  };
}
