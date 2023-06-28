import { Observable } from 'rxjs';

export const ContextService = 'oryx.ContextService';
export const ContextServiceFallback = 'oryx.ContextServiceFallback*';

export interface ContextService {
  provide(element: Element, key: string, value: unknown): void;
  get<T>(element: Element | undefined, key: string): Observable<T>;
  remove(element: Element, key: string): void;
}

declare global {
  interface InjectionTokensContractMap {
    [ContextService]: ContextService;
    [ContextServiceFallback]: Observable<unknown>;
  }
}
