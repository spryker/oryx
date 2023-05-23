import { Observable, from } from 'rxjs';
import { indexedDbStorageName, IndexedStorage, indexedDbTableName, StoredValue } from './model';
import { Dexie, PromiseExtended, liveQuery } from 'dexie';

export class IndexedDbStorage implements IndexedStorage {
  protected db = this.openDb();
  protected openDb(): PromiseExtended<Dexie> {
    const db = new Dexie(indexedDbStorageName);
    db.version(1).stores({
      [indexedDbTableName]: '&key,value'
    });

    return db.open();
  }

  getItem(key: string): Observable<StoredValue> {
    return from(liveQuery<StoredValue>(async () => {
      const db = await this.db;     
      return (await db.table(indexedDbTableName).get(key))?.value;
    }));
  }
  
  async setItem(key: string, value: string): Promise<void> {
    const db = await this.db;
    await db.table(indexedDbTableName).put({key, value});
  };

  async removeItem(key: string): Promise<void> {
    const db = await this.db;
    await db.table(indexedDbTableName).delete(key);
  };

  async clear(): Promise<void> {
    const db = await this.db;
    await db.table(indexedDbTableName).clear();
  };
}
