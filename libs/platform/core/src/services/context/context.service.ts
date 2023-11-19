import { Observable } from 'rxjs';

export const ContextService = 'oryx.ContextService';
export const ContextFallback = 'oryx.ContextFallback*';
export const ContextSerializer = 'oryx.ContextSerializer*';

export interface ContextService {
  provide(element: Element, key: string, value: unknown): void;
  /**
   * Retrieves the value of the context for the given element.
   * If element is null, the value is retrieved from the global/fallback context.
   */
  get<T>(element: Element | null, key: string): Observable<T | undefined>;
  remove(element: Element, key: string): void;

  /**
   * Serializes the value for the given key, making it suitable for usage as a data attribute.
   */
  serialize<T>(key: string, value: T): Observable<string>;
  deserialize<T>(key: string, value: string): Observable<T | undefined>;
}

export interface ContextSerializer<T = unknown> {
  serialize(value: T): Observable<string>;
  deserialize(value: string): Observable<T | undefined>;
}

declare global {
  interface InjectionTokensContractMap {
    [ContextService]: ContextService;
    [ContextFallback]: Observable<unknown>;
    [ContextSerializer]: ContextSerializer;
  }
}
