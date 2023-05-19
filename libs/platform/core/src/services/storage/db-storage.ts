import { indexedDbStorageName, IndexedDbStorage, indexedDbTableName } from './model';
import { Dexie, PromiseExtended } from 'dexie';

export class DbStorage implements IndexedDbStorage {
  protected openDb(): PromiseExtended<Dexie> {
    const db = new Dexie(indexedDbStorageName);
    db.version(1).stores({
      [indexedDbTableName]: '&key,value'
    });

    return db.open();
  }

  async getItem(key: string): Promise<string | null> {
    console.log('get', key);
    const db = await this.openDb();
    const entity = await db.table(indexedDbTableName).get(key);
    return entity?.value ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    console.log('set', key, value);
    const db = await this.openDb();
    await db.table(indexedDbTableName).put({key, value});
    db.close();
  };

  async removeItem(key: string): Promise<void> {
    console.log('remove', key);
    const db = await this.openDb();
    await db.table(indexedDbTableName).delete(key);
    db.close();
  };

  async clear(): Promise<void> {
    console.log('clear');
    const db = await this.openDb();
    await db.table(indexedDbTableName).clear();
    db.close();
  };
}
