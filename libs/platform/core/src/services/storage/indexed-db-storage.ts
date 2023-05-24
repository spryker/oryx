import { Dexie, liveQuery } from 'dexie';
import { Observable, shareReplay, switchMap } from 'rxjs';
import {
  indexedDbStorageName,
  indexedDbTableName,
  IndexedStorage,
  StoredValue,
} from './model';

export class IndexedDbStorage implements IndexedStorage {
  protected db = new Observable<Dexie>((subscriber) => {
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

      return db;
    }),
    shareReplay({ refCount: false, bufferSize: 1 })
  );

  getItem(key: string): Observable<StoredValue> {
    return this.db.pipe(
      switchMap((db) =>
        liveQuery<StoredValue>(async () => {
          return (await db.table(indexedDbTableName).get(key))?.value;
        })
      )
    );
  }

  setItem(key: string, value: string): void {
    this.db.subscribe(
      async (db) => await db.table(indexedDbTableName).put({ key, value })
    );
  }

  removeItem(key: string): void {
    this.db.subscribe(
      async (db) => await db.table(indexedDbTableName).delete(key)
    );
  }

  clear(): void {
    this.db.subscribe(async (db) => await db.table(indexedDbTableName).clear());
  }
}
