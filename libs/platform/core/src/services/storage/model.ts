import { Observable } from "rxjs";

export const enum StorageType {
  Local = 'local',
  Session = 'session',
  Idb = 'idb'
}

export const indexedDbStorageName = 'oryx-local-db-storage';
export const indexedDbTableName = 'oryx.storage';

export interface IndexedStorage {
  getItem(key: string): Observable<StoredValue>;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

export type StoredValue = string | void;