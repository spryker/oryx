import { Observable } from 'rxjs';

export const ContextService = 'oryx.ContextService';
export const ContextServiceFallback = 'oryx.ContextServiceFallback*';

export interface ContextService {
  provide(element: Element, key: string, value: unknown): void;
  /**
   * Retrieves the value of the context for the given element.
   * If element is null, the value is retrieved from the global/fallback context.
   */
  get<T>(element: Element | null, key: string): Observable<T>;
  remove(element: Element, key: string): void;
}

declare global {
  interface InjectionTokensContractMap {
    [ContextService]: ContextService;
    [ContextServiceFallback]: Observable<unknown>;
  }
}
