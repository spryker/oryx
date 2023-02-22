import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  from,
  map,
  merge,
  Observable,
  shareReplay,
  Subscription,
  switchMap,
  take,
  takeUntil,
  tap,
  using,
} from 'rxjs';
import { CoreQueryService } from '../core';
import { Query, QueryOptions, QueryState } from './model';

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
    protected query: CoreQueryService,
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

    const resetTrigger$ = merge(this.options.resetOn ?? []).pipe(
      tap(() => {
        if (subject$.value !== initialState) {
          subject$.next(initialState);
        }
      })
    );

    const refreshTrigger$ = merge(this.options.refreshOn ?? []).pipe(
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
      // TODO: check if this is needed, or decide if we want to debounce or make it configurable
      debounceTime(0),
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
        subject$.next({ error: false, loading: false, stale: false, data });
        this.onLoad(data, qualifier);
      }),
      catchError((error, source$) => {
        subject$.next({ error, loading: false, stale: false, data: undefined });
        this.onError(error, qualifier);
        return source$;
      })
    );

    let offlineSub: Subscription | undefined;

    const state$ = using(
      () => {
        offlineSub?.unsubscribe();

        const subscription = loadLogic$.subscribe();
        subscription.add(() => resetTrigger$.subscribe());

        return {
          unsubscribe: () => {
            subscription.unsubscribe();

            if (this.options.volatile) {
              // if query is volatile set it to initial state
              subject$.next(initialState);
              return;
            }

            offlineSub = merge(refreshTrigger$, resetTrigger$)
              .pipe(take(1))
              .subscribe(() => subject$.next(initialState));
          },
        };
      },
      () => subject$
    ).pipe(shareReplay({ bufferSize: 1, refCount: !!this.options.permanent }));

    const data$ = state$.pipe(
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
    this.options.onLoad?.forEach((callback: any) => {
      this.dispatchEvent(callback, qualifier, data);
    });
  }

  protected onError(error: any, qualifier?: Qualifier): void {
    this.options.onError?.forEach((callback: any) =>
      this.dispatchEvent(callback, qualifier, undefined, error)
    );
  }

  protected dispatchEvent(
    callback: (data: any, qualifier?: Qualifier) => any | string,
    qualifier?: Qualifier,
    data?: ValueType,
    error?: any
  ): void {
    if (typeof callback === 'function') {
      const event = callback(data, qualifier);
      if (event) this.query.emit(event);
    } else {
      const event: any = { type: callback, qualifier };
      if (data) event.data = data;
      if (error) event.error = error;
      this.query.emit(event);
    }
  }
}
