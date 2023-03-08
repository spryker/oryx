import { Observable } from 'rxjs';
import { StorageType } from './model';

export const StorageService = 'oryx.StorageService';

export interface StorageService {
  get<T = unknown>(key: string, type?: StorageType): Observable<T | null>;
  set(key: string, value: unknown, type?: StorageType): Observable<void>;
  remove(key: string, type?: StorageType): Observable<void>;
  clear(type?: StorageType): Observable<void>;
}

declare global {
  interface InjectionTokensContractMap {
    [StorageService]: StorageService;
  }
}
