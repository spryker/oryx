import { injectEnv } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { IndexedDbEntities } from '@spryker-oryx/indexed-db';
import { InferType, isDefined } from '@spryker-oryx/utilities';
import { Dexie, Table, Transaction } from 'dexie';
import { Observable, map, of, shareReplay, switchMap } from 'rxjs';
import {
  IndexedDbEntityType,
  IndexedDbIndexAutoIncrement,
  IndexedDbIndexMultiEntry,
  IndexedDbIndexUnique,
  IndexedDbMigrationFn,
} from '../models';
import {
  IndexedDbForeignKeyMetadata,
  IndexedDbIndexMetadata,
  IndexedDbPrimaryKeyMetadata,
  IndexedDbSchemaMetadata,
} from '../schema-metadata';
import { DexieIndexedDbConfig } from './dexie-config.provider';
import { IndexedDbService } from './indexed-db.service';

declare global {
  interface IndexedDbIntance {
    type: OryxDexieDb;
  }

  interface IndexedDbMigrationArgs {
    args: [Transaction];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface OryxDexieDb extends Dexie {}

  interface IndexedDbStoreMap<TEntity extends IndexedDbEntityType> {
    type: Table<TEntity['prototype']>;
  }
}

declare global {
  export interface InjectionTokensContractMap {
    [DexieIndexedDbService.di]: DexieIndexedDbService;
  }
}

export class DexieIndexedDbService implements IndexedDbService<OryxDexieDb> {
  static readonly di = 'oryx.DexieIndexedDbService';

  protected dbName: string;
  protected debug: (...data: unknown[]) => void;

  protected storeNameMap = new Map<IndexedDbEntityType, string>();
  protected populateCallbacks = new Set<(tx: Transaction) => void>();

  protected db = new Observable<OryxDexieDb>((subscriber) => {
    this.debug(`Creating IndexedDb with name ${this.dbName}`);

    const db = new Dexie(this.dbName) as OryxDexieDb;

    subscriber.next(db);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => {
      this.debug(`Closing IndexedDb with name ${this.dbName}`);

      db.close();
    };
  }).pipe(
    switchMap((db) => this.persistStorage().then(() => db)),
    switchMap((db) =>
      (this.entityTypes
        ? this.registerEntities(this.entityTypes.flat())
        : of(void 0)
      ).pipe(map(() => db))
    ),
    switchMap((db) => this.initDb(db).pipe(map(() => db))),
    switchMap(async (db) => {
      this.debug(`Opening IndexedDb with name ${this.dbName}`);

      await db.open();

      return db;
    }),
    shareReplay({ refCount: false, bufferSize: 1 })
  );

  constructor(
    protected config = inject(DexieIndexedDbConfig, null),
    protected isDev = injectEnv('DEV', false),
    protected entityTypes = inject(IndexedDbEntities, null)
  ) {
    this.dbName = this.config?.dbName ?? 'app-db';
    this.debug =
      this.config?.debug ?? !!this.isDev ? console.debug : () => void 0;
  }

  registerEntities(entityTypes: IndexedDbEntityType[]): Observable<void> {
    this.debug(`Registered ${entityTypes.length} new entities`, entityTypes);

    // Nothing to do with `entityTypes` as metadata auto-collected by decorators
    return of(void 0);
  }

  onPopulate(callback: (transaction: Transaction) => void): void {
    this.populateCallbacks.add(callback);
  }

  getDb(): Observable<OryxDexieDb> {
    return this.db;
  }

  getStoreName(entityType: IndexedDbEntityType): string {
    return (
      this.storeNameMap.get(entityType) ?? this.entityToStoreName(entityType)
    );
  }

  getStore<TEntity extends IndexedDbEntityType>(
    entityType: TEntity
  ): Observable<Table<InferType<TEntity>>> {
    return this.getDb().pipe(
      map((db) => db.table(this.getStoreName(entityType)))
    );
  }

  protected async persistStorage(): Promise<void> {
    if (!navigator.storage.persist || (await navigator.storage.persisted())) {
      return;
    }

    const isPersisted = await navigator.storage.persist();

    if (!isPersisted) {
      console.warn(
        'Storage could not be made persistent which can lead to accidental data loss!'
      );
    }
  }

  protected initDb(db: OryxDexieDb): Observable<void> {
    db.on('populate', async (tx) => {
      this.debug(`Populating IndexedDb with initial data`);

      await Promise.all(
        Array.from(this.populateCallbacks.values()).map((cb) => cb(tx))
      );
    });

    const metadataGroups = IndexedDbSchemaMetadata.collect();

    this.debug(`Initializing IndexedDb with metadata`, metadataGroups);

    metadataGroups.forEach((metadataGroup) => {
      const dbVersion = db.version(metadataGroup.version);
      const schema = this.mapMetadataToSchema(metadataGroup.metadata);
      const migrations = this.getMigrations(metadataGroup.metadata);

      this.debug(
        `Settinp up IndexedDb version ${metadataGroup.version} with schema`,
        schema
      );

      metadataGroup.metadata.forEach((metadata) => {
        if (metadata.storeName) {
          this.storeNameMap.set(metadata.entityType, metadata.storeName);
        }
      });

      dbVersion.stores(schema);

      if (migrations.length) {
        dbVersion.upgrade(async (tx) => {
          this.debug(
            `Running ${migrations.length} migration(s) on IndexedDb version ${metadataGroup.version}`
          );

          await Promise.all(migrations.map((migration) => migration(db, tx)));

          this.debug(
            `Migrations for IndexedDb version ${metadataGroup.version} completed!`
          );
        });
      }
    });

    return of(void 0);
  }

  protected mapMetadataToSchema(
    metadatas: IndexedDbSchemaMetadata[]
  ): Record<string, string> {
    return metadatas.reduce(
      (schema, metadata) => ({
        ...schema,
        [this.mapStoreName(metadata)]: this.mapStoreDefinition(
          metadata,
          metadatas
        ),
      }),
      {}
    );
  }

  protected mapStoreName(metadata: IndexedDbSchemaMetadata): string {
    return metadata.storeName ?? this.entityToStoreName(metadata.entityType);
  }

  protected mapStoreDefinition(
    metadata: IndexedDbSchemaMetadata,
    metadatas: IndexedDbSchemaMetadata[]
  ): string | null {
    if (metadata.unset) {
      return null;
    }

    const primaryIndex = this.mapIndex(metadata.primaryKey);
    const indexes = metadata.indexes.map((index) => this.mapIndex(index));
    const compoundIndexes = this.mapCompoundIndexes(metadata);
    const fkIndexes = this.mapForeignKeys(metadata.foreignKeys, metadatas);

    return [primaryIndex, ...indexes, ...compoundIndexes, ...fkIndexes]
      .filter(isDefined)
      .join(',');
  }

  protected mapIndex(
    index?: IndexedDbPrimaryKeyMetadata | IndexedDbIndexMetadata
  ): string | undefined {
    if (!index) {
      return '';
    }

    if (index.unset) {
      return;
    }

    const modifier = (index as IndexedDbIndexAutoIncrement).autoIncrement
      ? '++'
      : (index as IndexedDbIndexUnique).unique
      ? '&'
      : (index as IndexedDbIndexMultiEntry).multiEntry
      ? '*'
      : '';

    return `${modifier}${index.propPath}`;
  }

  protected mapCompoundIndexes(metadata: IndexedDbSchemaMetadata): string[] {
    return (
      metadata.compound?.map((compound) => `[${compound.join('+')}]`) ?? []
    );
  }

  protected mapForeignKeys(
    fkMetadatas: IndexedDbForeignKeyMetadata[],
    metadatas: IndexedDbSchemaMetadata[]
  ): string[] {
    // Foreign keys must be resolved manually - no inner implementation supported!
    return [];
  }

  protected getMigrations(
    metadatas: IndexedDbSchemaMetadata[]
  ): IndexedDbMigrationFn[] {
    return metadatas
      .flatMap((metadata) => [
        metadata.migration,
        metadata.primaryKey?.migration,
        ...metadata.indexes.map((index) => index.migration),
      ])
      .filter(isDefined);
  }

  protected entityToStoreName(entityType: IndexedDbEntityType): string {
    return entityType.name.toLowerCase();
  }
}
