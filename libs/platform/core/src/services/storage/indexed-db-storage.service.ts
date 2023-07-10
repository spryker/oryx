import { Observable } from 'rxjs';
import { StoredValue } from './model';

export const IndexedDBStorageService = 'oryx.IndexedDBStorageService';

export const indexedDbStorageName = 'oryx-local-db-storage';
export const indexedDbTableName = 'oryx.storage';

export interface IndexedDBStorageService {
  getItem(key: string): Observable<StoredValue>;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

declare global {
  interface InjectionTokensContractMap {
    [IndexedDBStorageService]: IndexedDBStorageService;
  }
}
