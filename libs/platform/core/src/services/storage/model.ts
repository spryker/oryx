export const enum StorageType {
  Local = 'local',
  Session = 'session',
  Db = 'db'
}

export const indexedDbStorageName = 'oryx-local-db-storage';
export const indexedDbTableName = 'oryx.storage';


export interface IndexedDbStorage {
  getItem(key: string): Promise<string>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}