import { indexedDbStorageName, IndexedDbStorage, indexedDbTableName } from './model';
import { Dexie, PromiseExtended } from 'dexie';

export class DbStorage implements IndexedDbStorage {
  protected db = this.openDb();
  protected openDb(): PromiseExtended<Dexie> {
    const db = new Dexie(indexedDbStorageName);
    db.version(1).stores({
      [indexedDbTableName]: '&key,value'
    });

    return db.open();
  }

  async getItem(key: string): Promise<string | null> {
    const db = await this.db;
    const entity = await db.table(indexedDbTableName).get(key);
    return entity?.value ?? null;
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
