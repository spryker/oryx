import { inject } from '@spryker-oryx/di';
import { Command, CommandOptions, Query, QueryOptions } from '../models';
import { QueryService } from '../query.service';

export function createQuery<
  ValueType,
  Qualifier extends object | undefined = undefined
>(options: QueryOptions<ValueType, Qualifier>): Query<ValueType, Qualifier> {
  return inject(QueryService).createQuery(options);
}

export function createCommand<
  ResultType,
  Qualifier extends object | undefined = undefined
>(
  options: CommandOptions<ResultType, Qualifier>
): Command<ResultType, Qualifier> {
  return inject(QueryService).createCommand(options);
}

export function createEffect(effect: any): unknown {
  return inject(QueryService).createEffect(effect);
}
