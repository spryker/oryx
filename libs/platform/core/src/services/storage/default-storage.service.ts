import { Observable, of } from 'rxjs';
import { StorageType } from './model';
import { StorageService } from './storage.service';

export class DefaultStorageService implements StorageService {
  protected getStorage(type = StorageType.LOCAL): Storage {
    return type === StorageType.LOCAL ? localStorage : sessionStorage;
  }

  get<T = unknown>(
    key: string,
    type = StorageType.LOCAL
  ): Observable<T | null> {
    try {
      return of(JSON.parse(this.getStorage(type).getItem(key) as string));
    } catch (e) {
      console.error(e);
    }
    return of(null);
  }

  set(key: string, value: unknown, type = StorageType.LOCAL): Observable<void> {
    this.getStorage(type).setItem(key, JSON.stringify(value));
    return of(undefined);
  }

  remove(key: string, type = StorageType.LOCAL): Observable<void> {
    this.getStorage(type).removeItem(key);
    return of(undefined);
  }

  clear(type = StorageType.LOCAL): Observable<void> {
    this.getStorage(type).clear();
    return of(undefined);
  }
}
