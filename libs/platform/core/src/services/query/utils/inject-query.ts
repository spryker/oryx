import { inject } from '@spryker-oryx/di';
import { Query } from '../models';
import { QueryService } from '../query.service';

export function injectQuery<
  ValueType = unknown,
  Qualifier extends object | undefined = undefined
>(id: string): Query<ValueType, Qualifier> {
  const query = inject(QueryService).getQuery<ValueType, Qualifier>(id);
  if (!query) {
    throw new Error(`Query with id "${id}" is not provided`);
  }
  return query;
}
