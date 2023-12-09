import { Observable } from 'rxjs';

export const EntityService = 'oryx.EntityService';
export const EntityProvider = 'oryx.EntityServiceProvider*';

export interface EntityProvider<E = unknown, Q = unknown> {
  type: string;
  service: string;
  // factory?: () => E;
  context?: string;
  // contextToQualifier?: () => Q;
}

export interface EntityQualifier<T = unknown> {
  type: string;
  // qualifier used to resolve entity
  qualifier?: T;
  // resolve qualifier from context, if not provided
  element?: Element | null;
}

export interface EntityFieldQualifier<T = unknown> extends EntityQualifier<T> {
  /** pick field */
  field: string;
}

export interface EntityService {
  get<E = unknown, T = unknown>(entity: EntityQualifier<T>): Observable<E>;
  getField<T = unknown>(entity: EntityFieldQualifier<T>): Observable<T>;
}

declare global {
  interface InjectionTokensContractMap {
    [EntityService]: EntityService;
    [EntityProvider]: EntityProvider;
  }
}
