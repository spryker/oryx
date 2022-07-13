import { StorageType } from './model';
import { StorageService } from './storage.service';

export class DefaultStorageService implements StorageService {
  protected getStorage(type = StorageType.DEFAULT): Storage {
    return type === StorageType.DEFAULT ? localStorage : sessionStorage;
  }

  get<T = unknown>(key: string, type = StorageType.DEFAULT): T | null {
    try {
      return JSON.parse(this.getStorage(type).getItem(key) as string);
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  set(key: string, value: unknown, type = StorageType.DEFAULT): void {
    this.getStorage(type).setItem(key, JSON.stringify(value));
  }

  remove(key: string, type = StorageType.DEFAULT): void {
    this.getStorage(type).removeItem(key);
  }

  clear(type = StorageType.DEFAULT): void {
    this.getStorage(type).clear();
  }
}
