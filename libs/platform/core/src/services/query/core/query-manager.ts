import { Observable } from 'rxjs';
import {
  Command,
  CommandOptions,
  EffectDefinition,
  Query,
  QueryEvent,
  QueryOptions,
} from '../models';

export interface QueryManager {
  createQuery<ValueType, Qualifier extends object | undefined = undefined>(
    options: QueryOptions<ValueType, Qualifier>
  ): Query<ValueType, Qualifier>;

  getQuery<
    ValueType = unknown,
    Qualifier extends object | undefined = undefined
  >(
    id: string
  ): Query<ValueType, Qualifier> | undefined;

  createCommand<ResultType, Qualifier extends object | undefined = undefined>(
    options: CommandOptions<ResultType, Qualifier>
  ): Command<ResultType, Qualifier>;

  getCommand<
    ResultType = unknown,
    Qualifier extends object | undefined = undefined
  >(
    id: string
  ): Command<ResultType, Qualifier> | undefined;

  createEffect(effect: EffectDefinition): void;
  emit(event: QueryEvent): void;

  getEvents(eventType?: string): Observable<QueryEvent>;

  dispose(): void;
}
