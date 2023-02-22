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
import { CoreQueryService } from '../core';
import { Command, CommandOptions, CommandStrategy } from './model';

export class CoreCommand<
  ResultType,
  Qualifier extends object | undefined = undefined
> implements Command<ResultType, Qualifier>
{
  protected currentResult?: ReplaySubject<any>;
  protected currentSubscription?: Subscription;

  constructor(
    protected options: CommandOptions<ResultType, Qualifier>,
    protected query: CoreQueryService,
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
    const result = new ReplaySubject<any>(1);
    if (this.currentResult) {
      concat(this.currentResult, this.getStream(result, qualifier)).subscribe();
      this.currentResult = result;
    }
    return result;
  }

  protected executeParallelStrategy(
    qualifier: Qualifier
  ): Observable<ResultType> {
    const result = new ReplaySubject<any>(1);
    this.getStream(result, qualifier).subscribe();
    return result;
  }

  protected executeReplaceStrategy(
    qualifier: Qualifier
  ): Observable<ResultType> {
    const result = new ReplaySubject<any>(1);
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      if (this.options.strategy === CommandStrategy.Override) {
        this.currentResult?.error('Command cancelled');
      }
      this.currentResult?.complete();
    }
    this.currentResult = result;
    this.currentSubscription = this.getStream(result, qualifier).subscribe();
    return result;
  }

  protected executeSkipStrategy(qualifier: Qualifier): Observable<ResultType> {
    const result = new ReplaySubject<any>(1);
    if (!this.currentResult?.closed) {
      if (this.options.strategy === CommandStrategy.Cancel) {
        result.error('Command cancelled');
      }
      result.complete();
    } else {
      this.currentResult = result;
      this.currentSubscription = this.getStream(result, qualifier).subscribe();
    }
    return result;
  }

  protected getStream(
    result: ReplaySubject<any>,
    qualifier: Qualifier
  ): Observable<any> {
    this.onStart(qualifier);
    return from(this.options.action(qualifier)).pipe(
      tap((data) => {
        result.next(data);
        this.onSuccess(data, qualifier);
      }),
      catchError((error) => {
        result.error(error);
        this.onError(error, qualifier);
        return EMPTY;
      }),
      finalize(() => {
        result.complete();
        this.onFinish(qualifier);
      })
    );
  }

  protected onStart(qualifier?: Qualifier): void {
    this.options.onStart?.forEach((callback: any) => {
      this.dispatchEvent(callback, qualifier);
    });
  }

  protected onFinish(qualifier?: Qualifier): void {
    this.options.onFinish?.forEach((callback: any) =>
      this.dispatchEvent(callback, qualifier)
    );
  }

  protected onSuccess(data: ResultType, qualifier?: Qualifier): void {
    this.options.onSuccess?.forEach((callback: any) =>
      this.dispatchEvent(callback, qualifier, data)
    );
  }

  protected onError(error: any, qualifier?: Qualifier): void {
    this.options.onError?.forEach((callback: any) =>
      this.dispatchEvent(callback, qualifier, undefined, error)
    );
  }

  protected dispatchEvent(
    callback: (data: any, qualifier?: Qualifier) => any | string,
    qualifier?: Qualifier,
    data?: ResultType,
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
