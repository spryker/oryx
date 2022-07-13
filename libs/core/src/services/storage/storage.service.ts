import { StorageType } from './model';

export const StorageService = 'FES.StorageService';

export interface StorageService {
  get<T = unknown>(key: string, type?: StorageType): T | null;
  set(key: string, value: unknown, type?: StorageType): void;
  remove(key: string, type?: StorageType): void;
  clear(type?: StorageType): void;
}

declare global {
  interface InjectionTokensContractMap {
    [StorageService]: StorageService;
  }
}
