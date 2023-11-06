import { Observable } from 'rxjs';
import { StorageType } from './model';

export const StorageService = 'oryx.StorageService';
export const StorageStrategy = 'oryx.StorageStrategy*';

export interface StorageService {
  get<T = unknown>(
    key: string,
    type?: StorageType | string
  ): Observable<T | null>;
  set(
    key: string,
    value: unknown,
    type?: StorageType | string
  ): Observable<void>;
  remove(key: string, type?: StorageType | string): Observable<void>;
  clear(type?: StorageType | string): Observable<void>;
}

export interface StorageStrategy {
  getItem(key: string): Observable<string | null>;
  setItem(key: string, value: string): Observable<unknown> | void;
  removeItem(key: string): Observable<unknown> | void;
  clear(): Observable<unknown> | void;
}

declare global {
  interface InjectionTokensContractMap {
    [StorageService]: StorageService;
    [StorageStrategy]: StorageStrategy;
  }
}
