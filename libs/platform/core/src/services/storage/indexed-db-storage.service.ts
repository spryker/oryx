import { Observable } from 'rxjs';

/** @deprecated since 1.2 */
export const IndexedDBStorageService = 'oryx.IndexedDBStorageService';

/** @deprecated since 1.2 */
export const indexedDbStorageName = 'oryx-local-db-storage';
/** @deprecated since 1.2 */
export const indexedDbTableName = 'oryx.storage';

/** @deprecated since 1.2 */
export interface IndexedDBStorageService {
  getItem(key: string): Observable<string | null>;
  setItem(key: string, value: string): Observable<unknown>;
  removeItem(key: string): Observable<unknown>;
  clear(): Observable<unknown>;
}

declare global {
  interface InjectionTokensContractMap {
    [IndexedDBStorageService]: IndexedDBStorageService;
  }
}
