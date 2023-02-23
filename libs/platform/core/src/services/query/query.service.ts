import { Observable } from 'rxjs';
import { Command, CommandOptions, Query, QueryOptions } from './models';

export const QueryService = 'oryx.QueryService';

export const QUERY_TOKEN = 'oryx.QueryToken*';
export const EFFECT_TOKEN = 'oryx.EffectToken*';
export const COMMAND_TOKEN = 'oryx.CommandToken*';

export interface QueryService {
  createQuery<ValueType, Qualifier extends object | undefined = undefined>(
    options: QueryOptions<ValueType, Qualifier>
  ): Query<ValueType, Qualifier>;

  createCommand<ResultType, Qualifier extends object | undefined = undefined>(
    options: CommandOptions<ResultType, Qualifier>
  ): Command<ResultType, Qualifier>;

  createEffect(effect: any): void;

  getQuery<
    ValueType = unknown,
    Qualifier extends object | undefined = undefined
  >(
    id: string
  ): Query<ValueType, Qualifier> | undefined;
  getCommand<
    ResultType = unknown,
    Qualifier extends object | undefined = undefined
  >(
    id: string
  ): Command<ResultType, Qualifier> | undefined;

  emit(stateEvent: any): void;
  getEvents(eventType?: string): Observable<any>;
}

declare global {
  interface InjectionTokensContractMap {
    [QueryService]: QueryService;
  }
}
