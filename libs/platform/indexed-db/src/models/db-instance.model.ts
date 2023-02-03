import { IndexedDbEntityType } from './entity-type.model';

declare global {
  /**
   * Specify the type of IndexedDB instance by providing `type` property with it's type.
   *
   * The provided type is available in an alias {@link IndexedDbIntanceType}.
   *
   * @example
   * ```ts
   * declare global {
   *   interface IndexedDbIntance {
   *     type: MyDbTypeHere;
   *   }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IndexedDbIntance {}

  /**
   * Specify the type of migration function arguments by providing `args` property with it's type.
   *
   * The provided type is available in an alias {@link IndexedDbMigrationArgsType}.
   *
   * @example
   * ```ts
   * declare global {
   *   interface IndexedDbMigrationArgs {
   *     args: [MyArgType1, MyArgType2];
   *   }
   * }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IndexedDbMigrationArgs {}

  /**
   * Specify the type of entities to store mapping by providing `type` property
   * with it's mapped store type.
   *
   * The provided type is available in an alias {@link InferIndexedDbStore}.
   *
   * @example
   * ```ts
   * declare global {
   *   interface IndexedDbStoreMap<TEntity extends IndexedDbEntityType> {
   *     type: MyStoreType<TEntity>;
   *   }
   * }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
  interface IndexedDbStoreMap<TEntity extends IndexedDbEntityType> {}

  /**
   * Specify the type of entities to db type mapping by providing storeName property
   * with it's mapped entity type to a db type.
   *
   * The provided type is available in an alias {@link InferIndexedDbEntity}.
   *
   * @example
   * ```ts
   * declare global {
   *   interface IndexedDbEntityMap {
   *     'my-store': { entity: MyStoreEntity, mapTo: MyStoreDbType };
   *   }
   * }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
  interface IndexedDbEntityMap {}
}

export type IndexedDbIntanceType = IndexedDbIntance extends { type: infer T }
  ? T
  : unknown;

export type IndexedDbMigrationArgsType = IndexedDbMigrationArgs extends {
  args: [...infer T];
}
  ? T
  : never;

export type InferIndexedDbStore<TEntity extends IndexedDbEntityType> =
  IndexedDbStoreMap<InferIndexedDbEntity<TEntity>> extends { type: infer T }
    ? T
    : unknown;

export type InferIndexedDbEntity<TEntity extends IndexedDbEntityType> =
  IndexedDbEntityMap[keyof IndexedDbEntityMap] extends {
    entity: TEntity;
    mapTo: infer TMapped;
  }
    ? TMapped extends IndexedDbEntityType
      ? TMapped
      : TEntity
    : TEntity;
