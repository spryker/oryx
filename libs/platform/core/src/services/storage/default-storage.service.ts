import { Observable, of } from 'rxjs';
import { StorageType } from './model';
import { StorageService } from './storage.service';
import { DbStorage } from './db-storage';

export class DefaultStorageService implements StorageService {
  protected bdStorage = new DbStorage();

  protected getStorage(type = StorageType.Local): Storage | DbStorage {
    if (type === StorageType.Session) {
      return sessionStorage
    }

    return this.bdStorage;

    // return type === StorageType.Local ? localStorage ?? this.bdStorage : this.bdStorage;
  }

  constructor(){
    this.set('test', 'testsValue');
    this.get('test');
  }

  get<T = unknown>(
    key: string,
    type = StorageType.Local
  ): Observable<T | null> {
    console.log(key, type);
    
    try {
      (this.getStorage(type).getItem(key) as Promise<any>).then((a) => console.log(a))
      return of(JSON.parse(this.getStorage(type).getItem(key) as string));
    } catch (e) {
      console.error(e);
    }
    return of(null);
  }

  set(key: string, value: unknown, type = StorageType.Local): Observable<void> {
    console.log(key, value, type);
    
    this.getStorage(type).setItem(key, JSON.stringify(value));
    return of(undefined);
  }

  remove(key: string, type = StorageType.Local): Observable<void> {
    this.getStorage(type).removeItem(key);
    return of(undefined);
  }

  clear(type = StorageType.Local): Observable<void> {
    this.getStorage(type).clear();
    return of(undefined);
  }
}
