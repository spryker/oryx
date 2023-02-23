import { Observable } from 'rxjs';
import { QueryEventHandler } from './query-event';

export type QueryTrigger = string | Observable<any>;

export interface QueryOptions<
  ValueType,
  Qualifier extends object | undefined = undefined
> {
  id?: string;
  loader: (qualifier: Qualifier) => Promise<ValueType> | Observable<ValueType>;
  resetOn?: QueryTrigger[];
  refreshOn?: QueryTrigger[];

  onLoad?: QueryEventHandler[];
  onError?: QueryEventHandler[];

  /**
   * Query is not cached between subscriptions.
   */
  volatile?: boolean;

  /**
   * Query is active (refreshing) even without active subscriptions
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
  get(qualifier: Qualifier): Observable<ValueType | undefined>;
  getState(qualifier: Qualifier): Observable<QueryState<ValueType>>;
  set(data: {
    data: ValueType;
    qualifier?: Qualifier;
    optimistic?: boolean;
  }): void;
}
