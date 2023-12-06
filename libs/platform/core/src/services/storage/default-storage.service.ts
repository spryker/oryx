import { inject, INJECTOR } from '@spryker-oryx/di';
import { subscribeReplay, toObservable } from '@spryker-oryx/utilities';
import { isObservable, map, Observable, of } from 'rxjs';
import { IndexedDBStorageService } from './indexed-db-storage.service';
import { StorageType } from './model';
import { StorageService, StorageStrategy } from './storage.service';

export class DefaultStorageService implements StorageService {
  constructor(
    protected defaultStorageType: StorageType | string = StorageType.Local,
    /** @deprecated since 1.2 */
    protected ibdStorage = inject(IndexedDBStorageService, null),
    protected injector = inject(INJECTOR)
  ) {}

  protected storages: Record<
    StorageType | string,
    Storage | StorageStrategy | undefined
  > = {
    [StorageType.Session]:
      typeof sessionStorage !== 'undefined' ? sessionStorage : undefined,
    [StorageType.Local]:
      typeof localStorage !== 'undefined' ? localStorage : undefined,
    /** @deprecated since 1.2, remove */
    [StorageType.Idb]: this.ibdStorage ?? undefined,
  };

  get<T = unknown>(key: string, type?: StorageType): Observable<T | null> {
    try {
      const value = this.getStorage(type).getItem(key);
      return isObservable(value)
        ? value.pipe(map((v) => this.parseValue<T>(v)))
        : of(this.parseValue<T>(value));
    } catch (e) {
      console.error(e);
    }
    return of(null);
  }

  set(key: string, value: unknown, type?: StorageType): Observable<void> {
    return subscribeReplay(
      toObservable(this.getStorage(type).setItem(key, JSON.stringify(value)))
    ) as Observable<void>;
  }

  remove(key: string, type?: StorageType): Observable<void> {
    return subscribeReplay(
      toObservable(this.getStorage(type).removeItem(key))
    ) as Observable<void>;
  }

  clear(type?: StorageType): Observable<void> {
    return subscribeReplay(
      toObservable(this.getStorage(type).clear())
    ) as Observable<void>;
  }

  protected getStorage(
    type = this.defaultStorageType
  ): Storage | StorageStrategy {
    if (!this.storages[type]) {
      const implementation = this.injector.inject(
        `${StorageStrategy}${type}`,
        null
      );
      if (!implementation) {
        throw new Error(`No implementation for ${StorageStrategy}${type}`);
      }
      this.storages[type] = implementation;
    }

    return this.storages[type]!;
  }

  protected parseValue<T>(value: string | null): T | null {
    return value ? JSON.parse(value) : null;
  }
}
