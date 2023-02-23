import {
  Command,
  CommandOptions,
  CoreCommand,
  CoreQuery,
  EffectDefinition,
  isCallbackEffect,
  isStreamEffect,
  Query,
  QueryOptions,
  StateEvent,
} from '@spryker-oryx/core';
import {
  filter,
  identity,
  Observable,
  ReplaySubject,
  retry,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

export class CoreQueryService {
  protected queries = new Map<string, Query<unknown, any>>();
  protected commands = new Map<string, Command<unknown, any>>();

  protected stateEvents$ = new ReplaySubject<StateEvent>();

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

  createEffect(effect: EffectDefinition): void {
    if (isStreamEffect(effect)) {
      effect({ events$: this.stateEvents$, query: this })
        .pipe(retry())
        .subscribe();
    } else if (isCallbackEffect(effect)) {
      this.stateEvents$
        .pipe(
          filter((event) => event.type === effect[0]),
          tap((event) => effect[1]({ event, query: this })),
          retry(),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }

  emit(stateEvent: StateEvent): void {
    this.stateEvents$.next(stateEvent);
  }

  getEvents(eventType?: string): Observable<StateEvent> {
    return this.stateEvents$.pipe(
      eventType ? filter((event) => event.type === eventType) : identity
    );
  }

  dispose(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
}
