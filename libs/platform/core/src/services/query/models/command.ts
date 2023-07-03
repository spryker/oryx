import { Observable } from 'rxjs';
import { QueryEventHandler } from './query-event';

export enum CommandStrategy {
  /**
   * Executes consecutive comments in queue. Default.
   */
  Queue = 'queue',

  /**
   * Executes consecutive comments in paraller
   */
  Parallel = 'parallel',

  /**
   * Next command cancels previous one.
   */
  Replace = 'replace',

  /**
   * Next command cancels and errors previous one.
   */
  Override = 'override',

  /**
   * New command is not executed.
   */
  Skip = 'skip',

  /**
   * New command errors if previous is still ongoing.
   */
  Cancel = 'cancel',
}

export interface CommandOptions<
  ResultType,
  Qualifier extends object | undefined = undefined
> {
  id?: string;
  action: (
    qualifier: Qualifier
  ) => Promise<ResultType> | Observable<ResultType>;

  strategy?: CommandStrategy;

  onStart?: QueryEventHandler<ResultType, Qualifier>[];
  onFinish?: QueryEventHandler<ResultType, Qualifier>[];
  onError?: QueryEventHandler<ResultType, Qualifier>[];
  onSuccess?: QueryEventHandler<ResultType, Qualifier>[];
}

export interface Command<
  ResultType,
  Qualifier extends object | undefined = undefined
> {
  execute(qualifier?: Qualifier): Observable<ResultType>;
}
