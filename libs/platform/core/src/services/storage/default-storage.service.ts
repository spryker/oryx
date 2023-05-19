import { Observable, from, of } from 'rxjs';
import { StorageType } from './model';
import { StorageService } from './storage.service';
import { DbStorage } from './db-storage';
import { isPromise } from '@spryker-oryx/utilities';

export class DefaultStorageService implements StorageService {
  protected bdStorage = new DbStorage();

  get<T = unknown>(
    key: string,
    type = StorageType.Local
  ): Observable<T | null> {
    try {
      const value = this.getStorage(type).getItem(key);
      if (value) {
        return isPromise(value) ? from(value.then(v => this.parseValue<T>(v))) : of(this.parseValue<T>(value));
      }
    } catch (e) {
      console.error(e);
    }
    return of(null);
  }

  set(key: string, value: unknown, type = StorageType.Local): Observable<void> {
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

  protected getStorage(type?: StorageType): Storage | DbStorage {
    // switch(type){
    //   case StorageType.Db:
    //     return this.bdStorage;
    //   case StorageType.Session:
    //     return sessionStorage;
    //   default:
    //     return localStorage;
    // }

    return this.bdStorage;
  }

  protected parseValue<T>(value: string | null): T | null {
    return value ? JSON.parse(value) : null;
  }
}
