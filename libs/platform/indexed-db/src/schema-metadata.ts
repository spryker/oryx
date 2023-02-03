/**
 * @module A Module to collect metadata from entities captured by decorators
 * @internal Only for internal use withing the indexed-db package
 */

import {
  IndexedDbEntity,
  IndexedDbEntityType,
  IndexedDbForeignKey,
  IndexedDbIndex,
  IndexedDbPrimaryKey,
  IndexedDbVersioned,
} from './models';

export interface IndexedDbSchemaMetadata
  extends Omit<IndexedDbEntity, 'indexes'> {
  entityType: IndexedDbEntityType;
  version: number;
  indexes: IndexedDbIndexMetadata[];
  foreignKeys: IndexedDbForeignKeyMetadata[];
  primaryKey?: IndexedDbPrimaryKeyMetadata;
}

export interface IndexedDbPrimaryKeyMetadata
  extends IndexedDbPrimaryKey,
    IndexedDbPropMetadata {}

export type IndexedDbIndexMetadata =
  | IndexedDbPropMetadata
  | (IndexedDbIndex & IndexedDbPropMetadata);

export interface IndexedDbForeignKeyMetadata
  extends IndexedDbForeignKey,
    IndexedDbPropMetadata {}

export interface IndexedDbPropMetadata extends IndexedDbVersioned {
  propPath: string;
}

export interface IndexedDbSchemaMetadataGroup {
  version: number;
  metadata: IndexedDbSchemaMetadata[];
}

interface VersionedSchemaMetadataRecord {
  [version: string]: IndexedDbSchemaMetadata;
}

export class IndexedDbSchemaMetadata {
  protected static schemaMetadataMap = new Map<
    IndexedDbEntityType,
    VersionedSchemaMetadataRecord
  >();
  protected static isCollected = false;

  static add(
    entityType: IndexedDbEntityType,
    partialMetadata: Partial<Omit<IndexedDbSchemaMetadata, 'entityType'>>
  ): void {
    if (this.isCollected) {
      throw new Error(
        'IndexedDbSchemaMetadata: All metadata has been already collected!' +
          '\nPlease add metadata earlier before the `IndexedDbSchemaMetadata.collect()` call is made.'
      );
    }

    const metadata = this.getMetadataVersion(
      entityType,
      partialMetadata.version
    );

    if (partialMetadata.storeName !== undefined) {
      metadata.storeName = partialMetadata.storeName;
    }

    if (partialMetadata.compound !== undefined) {
      metadata.compound = partialMetadata.compound;
    }

    if (partialMetadata.foreignKeys) {
      metadata.foreignKeys.push(...partialMetadata.foreignKeys);
    }

    if (partialMetadata.unset !== undefined) {
      metadata.unset = partialMetadata.unset;
    }

    if (partialMetadata.migration !== undefined) {
      metadata.migration = partialMetadata.migration;
    }

    if (partialMetadata.primaryKey !== undefined) {
      const metadata = this.getMetadataVersion(
        entityType,
        partialMetadata.primaryKey.version
      );
      metadata.primaryKey = partialMetadata.primaryKey;
    }

    if (partialMetadata.indexes !== undefined) {
      partialMetadata.indexes.forEach((index) => {
        const metadata = this.getMetadataVersion(entityType, index.version);
        metadata.indexes.push(index);
      });
    }
  }

  /**
   * @returns Metadata groups sorted by version in ascending order
   */
  static collect(): IndexedDbSchemaMetadataGroup[] {
    this.isCollected = true;

    const metadataGroupRecord: Record<string, IndexedDbSchemaMetadataGroup> =
      {};

    for (const metadataVersion of this.schemaMetadataMap.values()) {
      for (const [version, metadata] of Object.entries(metadataVersion)) {
        if (!metadataGroupRecord[version]) {
          metadataGroupRecord[version] = {
            version: Number(version),
            metadata: [],
          };
        }

        metadataGroupRecord[version].metadata.push(metadata);
      }
    }

    const metadataGroups = Object.values(metadataGroupRecord).sort(
      (m1, m2) => m1.version - m2.version
    );

    return metadataGroups;
  }

  protected static getMetadataVersion(
    entityType: IndexedDbEntityType,
    version = 1
  ): IndexedDbSchemaMetadata {
    if (!this.schemaMetadataMap.has(entityType)) {
      this.schemaMetadataMap.set(entityType, {});
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const metadataVersions = this.schemaMetadataMap.get(entityType)!;

    if (!metadataVersions[version]) {
      metadataVersions[version] = {
        entityType,
        version,
        indexes: [],
        foreignKeys: [],
      };
    }

    return metadataVersions[version];
  }
}
