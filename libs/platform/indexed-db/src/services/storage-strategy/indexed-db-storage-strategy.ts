import { StorageStrategy } from '@spryker-oryx/core';
import { Dexie, liveQuery } from 'dexie';
import { Observable, shareReplay, switchMap } from 'rxjs';

export class IndexedDbStorageStrategy implements StorageStrategy {
  constructor(
    protected indexedDbStorageName = 'oryx-local-db-storage',
    protected indexedDbTableName = 'oryx.storage'
  ) {}

  protected storage = new Observable<Dexie>((subscriber) => {
    const db = new Dexie(this.indexedDbStorageName);
    db.version(1).stores({
      [this.indexedDbTableName]: '&key,value',
    });

    subscriber.next(db);

    return () => {
      db.close();
    };
  }).pipe(
    switchMap(async (db) => {
      await db.open();

      return db.table(this.indexedDbTableName);
    }),
    shareReplay({ refCount: false, bufferSize: 1 })
  );

  getItem(key: string): Observable<string | null> {
    return this.storage.pipe(
      switchMap((storage) =>
        liveQuery<string | null>(async () => {
          return (await storage.get(key))?.value;
        })
      )
    );
  }

  setItem(key: string, value: string): Observable<unknown> {
    return this.storage.pipe(
      switchMap((storage) => storage.put({ key, value }))
    );
  }

  removeItem(key: string): Observable<unknown> {
    return this.storage.pipe(switchMap((storage) => storage.delete(key)));
  }

  clear(): Observable<unknown> {
    return this.storage.pipe(switchMap((storage) => storage.clear()));
  }
}
