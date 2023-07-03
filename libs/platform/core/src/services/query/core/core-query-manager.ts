import { subscribeReplay } from '@spryker-oryx/utilities';
import {
  filter,
  identity,
  Observable,
  retry,
  Subject,
  takeUntil,
  tap,
  Unsubscribable,
} from 'rxjs';
import {
  Command,
  CommandOptions,
  EffectDefinition,
  isCallbackEffect,
  isStreamEffect,
  Query,
  QueryEvent,
  QueryOptions,
} from '../models';
import { CoreCommand } from './core-command';
import { CoreQuery } from './core-query';
import { QueryManager } from './query-manager';

export class CoreQueryManager implements QueryManager {
  protected queries = new Map<string, Query<unknown, any>>();
  protected commands = new Map<string, Command<unknown, any>>();

  protected stateEvents$ = new Subject<QueryEvent>();

  protected destroy$ = new Subject<undefined>();

  createQuery<ValueType, Qualifier extends object | undefined = undefined>(
    options: QueryOptions<ValueType, Qualifier>
  ): Query<ValueType, Qualifier> {
    const query = new CoreQuery<ValueType, Qualifier>(
      options,
      this,
      this.destroy$
    );
    if (options.id) {
      this.queries.set(options.id, query);
    }
    return query;
  }

  getQuery<
    ValueType = unknown,
    Qualifier extends object | undefined = undefined
  >(id: string): Query<ValueType, Qualifier> | undefined {
    return this.queries.get(id) as Query<ValueType, Qualifier> | undefined;
  }

  createCommand<ResultType, Qualifier extends object | undefined = undefined>(
    options: CommandOptions<ResultType, Qualifier>
  ): Command<ResultType, Qualifier> {
    const command = new CoreCommand<ResultType, Qualifier>(
      options,
      this,
      this.destroy$
    );
    if (options.id) {
      this.commands.set(options.id, command);
    }
    return command;
  }

  getCommand<
    ResultType = unknown,
    Qualifier extends object | undefined = undefined
  >(id: string): Command<ResultType, Qualifier> | undefined {
    return this.commands.get(id) as Command<ResultType, Qualifier> | undefined;
  }

  createEffect(effect: EffectDefinition): Observable<unknown> & Unsubscribable {
    if (isStreamEffect(effect)) {
      return subscribeReplay(
        effect({
          events$: this.stateEvents$.asObservable(),
          getEvents: this.getEvents.bind(this),
          query: this,
        }).pipe(retry())
      );
    } else if (isCallbackEffect(effect)) {
      return subscribeReplay(
        this.stateEvents$.pipe(
          filter((event) => event.type === effect[0]),
          tap((event) => effect[1]({ event, query: this })),
          retry(),
          takeUntil(this.destroy$)
        )
      );
    }
    throw new Error('Wrong effect definition');
  }

  emit(event: QueryEvent): void {
    this.stateEvents$.next(event);
  }

  getEvents(eventType?: string | string[]): Observable<QueryEvent> {
    return this.stateEvents$.pipe(
      eventType
        ? filter((event) =>
            Array.isArray(eventType)
              ? eventType.some((type) => type === event.type)
              : event.type === eventType
          )
        : identity
    );
  }

  dispose(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
