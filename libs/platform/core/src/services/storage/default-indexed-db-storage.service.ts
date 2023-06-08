import { Dexie, liveQuery } from 'dexie';
import { Observable, shareReplay, switchMap } from 'rxjs';
import {
  indexedDbStorageName,
  IndexedDBStorageService,
  indexedDbTableName,
} from './indexed-db-storage.service';
import { StoredValue } from './model';

export class DefaultIndexedDBStorageService implements IndexedDBStorageService {
  protected storage = new Observable<Dexie>((subscriber) => {
    const db = new Dexie(indexedDbStorageName);
    db.version(1).stores({
      [indexedDbTableName]: '&key,value',
    });

    subscriber.next(db);

    return () => {
      db.close();
    };
  }).pipe(
    switchMap(async (db) => {
      await db.open();

      return db.table(indexedDbTableName);
    }),
    shareReplay({ refCount: false, bufferSize: 1 })
  );

  getItem(key: string): Observable<StoredValue> {
    return this.storage.pipe(
      switchMap((storage) =>
        liveQuery<StoredValue>(async () => {
          return (await storage.get(key))?.value;
        })
      )
    );
  }

  setItem(key: string, value: string): void {
    this.storage.subscribe((storage) => storage.put({ key, value }));
  }

  removeItem(key: string): void {
    this.storage.subscribe((storage) => storage.delete(key));
  }

  clear(): void {
    this.storage.subscribe((storage) => storage.clear());
  }
}
