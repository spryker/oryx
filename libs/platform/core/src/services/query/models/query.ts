import { Observable } from 'rxjs';
import { QueryEventHandler } from './query-event';

export type QueryTrigger = string | Observable<any>;

export type QueryQualifierEnhancer<Qualifier> = (
  partialQualifier: Partial<Qualifier>
) => Qualifier /*| Observable<Qualifier>*/;

export type QueryTransformer<ValueType, Qualifier> = (
  data: ValueType,
  qualifier: Qualifier
) => ValueType /*| Observable<ValueType>*/ | void;

export interface QueryOptions<
  ValueType,
  Qualifier extends object | undefined = undefined
> {
  id?: string;
  loader: (qualifier: Qualifier) => Promise<ValueType> | Observable<ValueType>;

  resetOn?: QueryTrigger[];
  refreshOn?: QueryTrigger[];

  onLoad?: QueryEventHandler<ValueType, Qualifier>[];
  onError?: QueryEventHandler<ValueType, Qualifier>[];

  /**
   * Determines the cache key based on the provided qualifier.
   * This is useful to cache different data under the same key if they represent the same entity.
   * If not provided, the default behavior would be using the qualifier itself.
   */
  cacheKey?: (qualifier: Qualifier) => string | Partial<Qualifier>;

  /**
   * TODO
   * Automatically completes a qualifier if some of its fields are missing.
   * This is especially useful when only a subset of the qualifier is provided and
   * the rest can be inferred or fetched from elsewhere.
   */
  // qualifierEnhancers?: QueryQualifierEnhancer<Qualifier>[];

  /**
   * Transforms the data returned by the loader based on the qualifier or the model itself.
   * Useful for applying context-specific modifications to the model before it's consumed.
   */
  postTransforms?: QueryTransformer<ValueType, Qualifier>[];

  /**
   * Query is not cached between subscriptions
   * (experimental)
   */
  volatile?: boolean;

  /**
   * Query is active (refreshing) even without active subscriptions
   * (experimental)
   */
  permanent?: boolean;
}

export interface QueryState<T> {
  loading: boolean;
  stale: boolean;
  error: false | Error;
  data: T | undefined;
}

export interface Query<
  ValueType,
  Qualifier extends object | undefined = undefined
> {
  get(qualifier?: Qualifier): Observable<ValueType | undefined>;
  getState(qualifier?: Qualifier): Observable<QueryState<ValueType>>;
  set(data: {
    data: ValueType | ((prev: ValueType | undefined) => ValueType);
    qualifier?: Qualifier;
    optimistic?: boolean;
  }): void;
  reset(qualifier?: Qualifier): void;
  refresh(qualifier?: Qualifier): void;
}
