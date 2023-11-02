export const enum StorageType {
  Local = 'local',
  Session = 'session',
  /** @deprecated since 1.2, use IndexedDbStorageMethod from @spryker-oryx/indexed-db package */
  Idb = 'idb',
}

/** @deprecated since 1.2 */
export type StoredValue = string | void;
