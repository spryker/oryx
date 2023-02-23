import { Query, QueryService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';

export function injectQuery<
  ValueType = unknown,
  Qualifier extends object | undefined = undefined
>(id: string): Query<ValueType, Qualifier> {
  const query = inject(QueryService).getQuery<ValueType, Qualifier>(id);
  if (!query) throw new Error(`Query with id "${id}" is not provided`);
  return query;
}
