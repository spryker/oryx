import { Observable } from 'rxjs';

export const ContextService = 'oryx.ContextService';
export const ContextFallback = 'oryx.ContextFallback*';
export const ContextSerializer = 'oryx.ContextSerializer*';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ContextValue {}
}

export interface ContextService {
  provide(element: Element, key: string, value: unknown): void;
  /**
   * Retrieves the value of the context for the given element.
   * If element is null, the value is retrieved from the global/fallback context.
   */
  get<T extends keyof ContextValue>(
    element: Element | null,
    key: T
  ): Observable<ContextValue[T] | undefined>;
  get<T>(element: Element | null, key: string): Observable<T | undefined>;
  get(element: Element | null, key: unknown): Observable<unknown | undefined>;
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

export interface ContextFallbackParams {
  element: Element | null;
}

export type ContextFallbackHandler<Q = unknown> = (
  params: ContextFallbackParams
) => Observable<Q>;

declare global {
  interface InjectionTokensContractMap {
    [ContextService]: ContextService;
    [ContextFallback]: Observable<unknown> | ContextFallbackHandler;
    [ContextSerializer]: ContextSerializer;
  }
}
