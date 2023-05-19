import { indexedDbStorageName, IndexedDbStorage, indexedDbTableName } from './model';
import { Dexie, PromiseExtended, Table } from 'dexie';

export class DbStorage implements IndexedDbStorage {
    protected getDb(): PromiseExtended<Dexie> {
  
      const db = new Dexie(indexedDbStorageName);
      db.version(1).stores({
        [indexedDbTableName]: 'key,value'
      });
  
      return db.open();
    }

    protected async getStorage(): Promise<Table> {
        return (await this.getDb()).table(indexedDbTableName)
    }
  
    async getItem(key: string): Promise<string> {
      return (await this.getStorage()).get(key);
    }
  
    async setItem(key: string, value: string): Promise<void> {
        console.log(key, 'key');
        
        (await this.getStorage()).put(key, value);
    };
  
    async removeItem(key: string): Promise<void> {
        (await this.getStorage()).delete(key);
    };
  
    async clear(): Promise<void> {
        (await this.getStorage()).clear();
    };
}