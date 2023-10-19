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

  /**
   * TODO: add support
   * Automatically completes a qualifier if some of its fields are missing.
   * This is especially useful when only a subset of the qualifier is provided and
   * the rest can be inferred or fetched from elsewhere.
   */
  // qualifierEnhancers?: QueryQualifierEnhancer<Qualifier>[];

  /**
   * TODO: add support
   * Transforms the data returned by the loader based on the qualifier or the model itself.
   * Useful for applying context-specific modifications to the model before it's consumed.
   */
  // modifiers?: QueryTransformer<ResultType, Qualifier>[];
}

export interface Command<
  ResultType,
  Qualifier extends object | undefined = undefined
> {
  execute(qualifier?: Qualifier): Observable<ResultType>;
}
