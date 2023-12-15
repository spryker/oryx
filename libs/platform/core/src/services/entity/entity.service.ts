import { Observable } from 'rxjs';

export const EntityService = 'oryx.EntityService';

export interface EntityQualifier<T = unknown> {
  type?: string;
  // qualifier used to resolve entity
  qualifier?: T;
  // resolve qualifier from context, if not provided
  element?: Element | null;
}

export interface EntityFieldQualifier<T = unknown> extends EntityQualifier<T> {
  /** pick field */
  field?: string;
}

export interface EntityService {
  get<E = unknown, T = unknown>(
    entity: EntityQualifier<T>
  ): Observable<E | undefined>;
  getField<T = unknown>(
    entity: EntityFieldQualifier<T>
  ): Observable<T | undefined>;
}

declare global {
  interface InjectionTokensContractMap {
    [EntityService]: EntityService;
  }
}