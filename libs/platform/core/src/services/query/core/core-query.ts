import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  filter,
  from,
  map,
  merge,
  NEVER,
  Observable,
  shareReplay,
  skipWhile,
  Subject,
  Subscription,
  switchMap,
  take,
  takeUntil,
  tap,
  using,
} from 'rxjs';
import {
  Query,
  QueryEventHandler,
  QueryOptions,
  QueryState,
  QueryTrigger,
} from '../models';
import { buildEvent } from './build-event';
import { QueryManager } from './query-manager';

export class CoreQuery<
  ValueType,
  Qualifier extends object | undefined = undefined
> implements Query<ValueType, Qualifier>
{
  protected queryCache = new Map<
    string,
    {
      subject$: BehaviorSubject<QueryState<ValueType>>;
      state$: Observable<QueryState<ValueType>>;
      data$: Observable<ValueType | undefined>;
      refresh$: Subject<undefined>;
      reset$: Subject<undefined>;
    }
  >();

  constructor(
    protected options: QueryOptions<ValueType, Qualifier>,
    protected manager: QueryManager,
    protected destroyNotifier$?: Observable<undefined>
  ) {}

  protected getKey(qualifier: Qualifier): string {
    return qualifier
      ? JSON.stringify(
          Object.entries(qualifier)
            .filter((x) => x[1])
            .sort()
            .flat()
        )
      : '';
  }

  protected prepareKey(qualifier: Qualifier): string {
    const key = this.getKey(qualifier);
    if (!this.queryCache.has(key)) {
      this.setupQueryState(key, qualifier);
    }

    return key;
  }

  protected setupQueryState(key: string, qualifier: Qualifier): void {
    const initialState: QueryState<ValueType> = {
      error: false,
      loading: false,
      stale: false,
      data: undefined,
    };

    const subject$ = new BehaviorSubject<QueryState<ValueType>>(initialState);

    const needToLoad$ = subject$.pipe(
      filter(
        (state) =>
          !state.loading &&
          ((state.data === undefined && !state.error) || state.stale)
      )
    );

    const reset$ = new Subject<undefined>();
    const resetTrigger$ = this.getTriggerStream([
      ...(this.options.resetOn ?? []),
      reset$,
    ]).pipe(
      tap(() => {
        if (subject$.value !== initialState) {
          subject$.next(initialState);
        }
      })
    );

    const refresh$ = new Subject<undefined>();
    const refreshTrigger$ = this.getTriggerStream([
      ...(this.options.refreshOn ?? []),
      refresh$,
    ]).pipe(
      tap(() => {
        if (!subject$.value.stale || subject$.value.loading) {
          subject$.next({
            error: subject$.value.error,
            loading: false,
            stale: true,
            data: subject$.value.data,
          });
        }
      })
    );

    const loadLogic$ = needToLoad$.pipe(
      tap(() => {
        if (!subject$.value.loading) {
          subject$.next({
            error: subject$.value.error,
            loading: true,
            stale: subject$.value.stale,
            data: subject$.value.data,
          });
        }
      }),
      switchMap(() =>
        from(this.options.loader(qualifier)).pipe(takeUntil(resetTrigger$))
      ),
      tap((data) => {
        this.onLoad(data, qualifier);
        subject$.next({ error: false, loading: false, stale: false, data });
      }),
      catchError((error, source$) => {
        this.onError(error, qualifier);
        subject$.next({ error, loading: false, stale: false, data: undefined });
        return source$;
      })
    );

    let offlineSub: Subscription | undefined;

    const state$ = using(
      () => {
        offlineSub?.unsubscribe();

        const subscription = loadLogic$.subscribe();
        subscription.add(resetTrigger$.subscribe());
        subscription.add(refreshTrigger$.subscribe());

        return {
          unsubscribe: () => {
            subscription.unsubscribe();
            // we have to reset loading flag, if loading was interrupted by unsubscribe
            if (subject$.value.loading) {
              subject$.value.loading = false;
            }

            if (this.options.volatile) {
              // if query is volatile set it to initial state
              subject$.next(initialState);
              return;
            }

            offlineSub = merge(refreshTrigger$, resetTrigger$)
              .pipe(take(1), takeUntil(this.destroyNotifier$ ?? NEVER))
              .subscribe(() => subject$.next(initialState));
          },
        };
      },
      () => subject$
    ).pipe(shareReplay({ bufferSize: 1, refCount: !this.options.permanent }));

    const data$ = state$.pipe(
      skipWhile((state) => state.data === undefined && !state.error),
      map((x) => x.data),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.queryCache.set(key, { subject$, state$, data$, reset$, refresh$ });
  }

  get(qualifier: Qualifier): Observable<ValueType | undefined> {
    return this.queryCache.get(this.prepareKey(qualifier))!.data$;
  }

  getState(qualifier: Qualifier): Observable<QueryState<ValueType>> {
    return this.queryCache.get(this.prepareKey(qualifier))!.state$;
  }

  set({
    data,
    qualifier,
    optimistic,
  }: {
    data: ValueType | ((prev: ValueType | undefined) => ValueType);
    qualifier: Qualifier;
    optimistic?: boolean;
  }): void {
    const subject$ = this.queryCache.get(this.prepareKey(qualifier))!.subject$;

    data =
      typeof data === 'function'
        ? (data as (prev: ValueType | undefined) => ValueType)(
            subject$.value.data
          )
        : (data as ValueType);

    subject$.next({
      error: subject$.value.error,
      loading: subject$.value.loading,
      stale: optimistic ? true : subject$.value.stale,
      data,
    });
  }

  reset(qualifier: Qualifier): void {
    const key = this.getKey(qualifier);
    if (this.queryCache.has(key)) {
      this.queryCache.get(key)!.reset$.next(undefined);
    }
  }

  refresh(qualifier: Qualifier): void {
    const key = this.getKey(qualifier);
    if (this.queryCache.has(key)) {
      this.queryCache.get(key)!.refresh$.next(undefined);
    }
  }

  protected onLoad(data: ValueType, qualifier?: Qualifier): void {
    this.options.onLoad?.forEach((callback) => {
      this.dispatchEvent(callback, qualifier, data);
    });
  }

  protected onError(error: any, qualifier?: Qualifier): void {
    this.options.onError?.forEach((callback) =>
      this.dispatchEvent(callback, qualifier, undefined, error)
    );
  }

  protected dispatchEvent(
    handler: QueryEventHandler<ValueType, Qualifier>,
    qualifier?: Qualifier,
    data?: ValueType,
    error?: any
  ): void {
    const event = buildEvent<ValueType, Qualifier>(
      handler,
      qualifier,
      data,
      error
    );
    if (event) {
      this.manager.emit(event);
    }
  }

  protected getTriggerStream(
    triggers: QueryTrigger[] = []
  ): Observable<undefined> {
    return merge(
      ...triggers.map((trigger) =>
        typeof trigger === 'string' ? this.manager.getEvents(trigger) : trigger
      )
    );
  }
}
