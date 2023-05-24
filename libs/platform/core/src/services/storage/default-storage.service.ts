import { isObservable, map, Observable, of } from 'rxjs';
import { IndexedDbStorage } from './indexed-db-storage';
import { IndexedStorage, StorageType, StoredValue } from './model';
import { StorageService } from './storage.service';

export class DefaultStorageService implements StorageService {
  constructor(protected defaultStorageType = StorageType.Local) {}

  protected ibdStorage = new IndexedDbStorage();

  get<T = unknown>(key: string, type?: StorageType): Observable<T | null> {
    try {
      const value = this.getStorage(type).getItem(key);
      if (value) {
        return isObservable(value)
          ? value.pipe(map((v) => this.parseValue<T>(v)))
          : of(this.parseValue<T>(value));
      }
    } catch (e) {
      console.error(e);
    }
    return of(null);
  }

  set(key: string, value: unknown, type?: StorageType): Observable<void> {
    this.getStorage(type).setItem(key, JSON.stringify(value));
    return of(undefined);
  }

  remove(key: string, type?: StorageType): Observable<void> {
    this.getStorage(type).removeItem(key);
    return of(undefined);
  }

  clear(type?: StorageType): Observable<void> {
    this.getStorage(type).clear();
    return of(undefined);
  }

  protected getStorage(
    type = this.defaultStorageType
  ): Storage | IndexedStorage {
    switch (type) {
      case StorageType.Idb:
        return this.ibdStorage;
      case StorageType.Session:
        return sessionStorage;
      default:
        return localStorage;
    }
  }

  protected parseValue<T>(value: StoredValue): T | null {
    return value ? JSON.parse(value) : null;
  }
}
