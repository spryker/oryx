import { Observable, of } from 'rxjs';
import { StorageType } from './model';
import { StorageService } from './storage.service';

export class DefaultStorageService implements StorageService {
  protected getStorage(type = StorageType.DEFAULT): Storage {
    return type === StorageType.DEFAULT ? localStorage : sessionStorage;
  }

  get<T = unknown>(
    key: string,
    type = StorageType.DEFAULT
  ): Observable<T | null> {
    try {
      return of(JSON.parse(this.getStorage(type).getItem(key) as string));
    } catch (e) {
      console.error(e);
    }
    return of(null);
  }

  set(
    key: string,
    value: unknown,
    type = StorageType.DEFAULT
  ): Observable<void> {
    this.getStorage(type).setItem(key, JSON.stringify(value));
    return of();
  }

  remove(key: string, type = StorageType.DEFAULT): Observable<void> {
    this.getStorage(type).removeItem(key);
    return of();
  }

  clear(type = StorageType.DEFAULT): Observable<void> {
    this.getStorage(type).clear();
    return of();
  }
}
