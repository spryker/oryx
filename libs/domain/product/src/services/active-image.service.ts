import { Observable } from 'rxjs';

export interface ActiveImageService {
  get(sku: string, container?: string): Observable<number | undefined>;
  set(sku: string, container?: string, active?: number): void;
}

export const ActiveImageService = 'oryx.ActiveImageService';

declare global {
  interface InjectionTokensContractMap {
    [ActiveImageService]: ActiveImageService;
  }
}
