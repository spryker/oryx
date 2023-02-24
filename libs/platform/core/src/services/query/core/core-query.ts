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
  Subscription,
  switchMap,
  take,
  takeUntil,
  tap,
  using,
} from 'rxjs';
import { CoreQueryService } from '../core';
import {
  Query,
  QueryEventHandler,
  QueryOptions,
  QueryState,
  QueryTrigger,
} from '../models';
import { buildEvent } from './build-event';

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
    }
  >();

  constructor(
    protected options: QueryOptions<ValueType, Qualifier>,
    protected service: CoreQueryService,
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

    const resetTrigger$ = this.getTriggerStream(this.options.resetOn).pipe(
      tap(() => {
        if (subject$.value !== initialState) {
          subject$.next(initialState);
        }
      })
    );

    const refreshTrigger$ = this.getTriggerStream(this.options.refreshOn).pipe(
      tap(() => {
        if (!subject$.value.stale) {
          subject$.next({
            error: subject$.value.error,
            loading: subject$.value.loading,
            stale: true,
            data: subject$.value.data,
          });
        }
      })
    );

    const loadLogic$ = needToLoad$.pipe(
      tap(() => {
        if (subject$.value.loading!) {
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

    this.queryCache.set(key, { subject$, state$, data$ });
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
    data: ValueType;
    qualifier: Qualifier;
    optimistic?: boolean;
  }): void {
    const subject$ = this.queryCache.get(this.prepareKey(qualifier))!.subject$;
    subject$.next({
      error: subject$.value.error,
      loading: subject$.value.loading,
      stale: optimistic ? true : subject$.value.stale,
      data,
    });
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
      this.service.emit(event);
    }
  }

  protected getTriggerStream(
    triggers: QueryTrigger[] = []
  ): Observable<undefined> {
    return merge(
      ...triggers.map((trigger) =>
        typeof trigger === 'string' ? this.service.getEvents(trigger) : trigger
      )
    );
  }
}
