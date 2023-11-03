import {
  catchError,
  concat,
  EMPTY,
  finalize,
  from,
  Observable,
  ReplaySubject,
  Subscription,
  tap,
} from 'rxjs';
import {
  Command,
  CommandOptions,
  CommandStrategy,
  QueryEventHandler,
} from '../models';
import { buildEvent } from './build-event';
import { QueryManager } from './query-manager';

export class CoreCommand<
  ResultType,
  Qualifier extends object | undefined = undefined
> implements Command<ResultType, Qualifier>
{
  protected currentResult?: ReplaySubject<ResultType>;
  protected currentSubscription?: Subscription;

  constructor(
    protected options: CommandOptions<ResultType, Qualifier>,
    protected manager: QueryManager,
    protected destroyNotifier$?: Observable<undefined>
  ) {}

  execute(qualifier: Qualifier): Observable<ResultType> {
    switch (this.options.strategy) {
      case CommandStrategy.Parallel:
        return this.executeParallelStrategy(qualifier);
      case CommandStrategy.Replace:
      case CommandStrategy.Override:
        return this.executeReplaceStrategy(qualifier);
      case CommandStrategy.Skip:
      case CommandStrategy.Cancel:
        return this.executeSkipStrategy(qualifier);
      default:
        return this.executeQueueStrategy(qualifier);
    }
  }

  protected executeQueueStrategy(qualifier: Qualifier): Observable<ResultType> {
    const result = new ReplaySubject<ResultType>(1);
    if (
      !this.currentResult ||
      this.currentResult.closed ||
      // isStopped is deprecated in RxJS 7, but closed seems to not work properly?
      // To recheck when migrating to RxJs 8
      this.currentResult.isStopped
    ) {
      this.currentResult = result;
      this.getStream(result, qualifier).subscribe();
    } else {
      const oldResult = this.currentResult.pipe(catchError(() => EMPTY));
      this.currentResult = result;
      concat(oldResult, this.getStream(result, qualifier)).subscribe();
    }
    return result;
  }

  protected executeParallelStrategy(
    qualifier: Qualifier
  ): Observable<ResultType> {
    const result = new ReplaySubject<ResultType>(1);
    this.getStream(result, qualifier).subscribe();
    return result;
  }

  protected executeReplaceStrategy(
    qualifier: Qualifier
  ): Observable<ResultType> {
    const result = new ReplaySubject<ResultType>(1);
    if (this.currentSubscription && !this.currentSubscription.closed) {
      if (this.options.strategy === CommandStrategy.Override)
        this.currentResult!.error('Command cancelled');

      this.currentSubscription.unsubscribe();
      this.currentResult!.complete();
    }
    this.currentResult = result;
    this.currentSubscription = this.getStream(result, qualifier).subscribe();
    return result;
  }

  protected executeSkipStrategy(qualifier: Qualifier): Observable<ResultType> {
    const result = new ReplaySubject<ResultType>(1);
    if (this.currentResult && !this.currentResult?.closed) {
      if (this.options.strategy === CommandStrategy.Cancel)
        result.error('Command cancelled');

      result.complete();
    } else {
      this.currentResult = result;
      this.currentSubscription = this.getStream(result, qualifier).subscribe();
    }
    return result;
  }

  protected getStream(
    result: ReplaySubject<ResultType>,
    qualifier: Qualifier
  ): Observable<ResultType> {
    this.onStart(qualifier);
    return from(this.options.action(qualifier)).pipe(
      tap((data) => {
        this.onSuccess(data, qualifier);
        result.next(data);
      }),
      catchError((error) => {
        this.onError(error, qualifier);
        result.error(error);
        return EMPTY;
      }),
      finalize(() => {
        this.onFinish(qualifier);
        result.complete();
      })
    );
  }

  protected onStart(qualifier?: Qualifier): void {
    this.options.onStart?.forEach((handler) => {
      this.dispatchEvent(handler, qualifier);
    });
  }

  protected onFinish(qualifier?: Qualifier): void {
    this.options.onFinish?.forEach((handler) =>
      this.dispatchEvent(handler, qualifier)
    );
  }

  protected onSuccess(data: ResultType, qualifier?: Qualifier): void {
    this.options.onSuccess?.forEach((handler) =>
      this.dispatchEvent(handler, qualifier, data)
    );
  }

  protected onError(error: any, qualifier?: Qualifier): void {
    this.options.onError?.forEach((handler) =>
      this.dispatchEvent(handler, qualifier, undefined, error)
    );
  }

  protected dispatchEvent(
    handler: QueryEventHandler<ResultType, Qualifier>,
    qualifier?: Qualifier,
    data?: ResultType,
    error?: any
  ): void {
    const event = buildEvent<ResultType, Qualifier>(
      handler,
      qualifier,
      data,
      error
    );
    if (event) this.manager.emit(event);
  }
}
