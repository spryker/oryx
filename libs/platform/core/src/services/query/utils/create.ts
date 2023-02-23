import { inject } from '@spryker-oryx/di';
import { Command, CommandOptions } from '../command';
import { QueryService } from '../query.service';
import { Query, QueryOptions } from '../query/model';

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
