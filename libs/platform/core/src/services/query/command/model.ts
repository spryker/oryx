import { Observable } from 'rxjs';

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
   * Next command replaces previous one. Result from new command will be propagated to new command.
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

  onStart?: any[];
  onFinish?: any[];
  onError?: any[];
  onSuccess?: any[];
}

export interface Command<ResultType, Qualifier extends object | undefined = undefined> {
  execute(qualifier: Qualifier): Observable<ResultType>;
}
