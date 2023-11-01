import { subscribeReplay } from '@spryker-oryx/utilities';
import { map, Observable, shareReplay, Subscriber, switchMap } from 'rxjs';
import {
  indexedDbStorageName,
  IndexedDBStorageService,
  indexedDbTableName,
} from './indexed-db-storage.service';

/** @deprecated since 1.2 */
export class DefaultIndexedDBStorageService implements IndexedDBStorageService {
  protected db$: Observable<IDBDatabase> = new Observable(
    (subscriber: Subscriber<IDBDatabase>) => {
      const request = indexedDB.open(indexedDbStorageName, 1);

      request.onerror = () => subscriber.error('DB: error');
      request.onupgradeneeded = (evt: IDBVersionChangeEvent) => {
        const db = (evt.target as IDBOpenDBRequest).result;
        db.createObjectStore(indexedDbTableName, { keyPath: 'key' });
      };
      request.onsuccess = () => {
        subscriber.next(request.result);
        subscriber.complete();
      };
    }
  ).pipe(shareReplay(1));

  protected transactionRequest<T>(
    mode: IDBTransactionMode,
    storeAction: (store: IDBObjectStore) => IDBRequest<T>
  ): Observable<T> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<T>((subscriber) => {
            const transaction = db.transaction(indexedDbTableName, mode);
            const objectStore = transaction.objectStore(indexedDbTableName);
            const request = storeAction(objectStore);

            request.onerror = () =>
              subscriber.error('IndexedDB: transaction error');
            request.onsuccess = () => {
              subscriber.next(request.result);
              subscriber.complete();
            };
          })
      )
    );
  }

  getItem(key: string): Observable<string | null> {
    return this.transactionRequest('readonly', (store) => store.get(key)).pipe(
      map((x) => x?.value)
    );
  }

  setItem(key: string, value: string): Observable<unknown> {
    return subscribeReplay(
      this.transactionRequest('readwrite', (store) => store.put({ key, value }))
    );
  }

  removeItem(key: string): Observable<unknown> {
    return subscribeReplay(
      this.transactionRequest('readwrite', (store) => store.delete(key))
    );
  }

  clear(): Observable<unknown> {
    return subscribeReplay(
      this.transactionRequest('readwrite', (store) => store.clear())
    );
  }
}
