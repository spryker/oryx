import { QueryEvent, QueryEventHandler } from '../models/query-event';

export function buildEvent<Data = unknown, Qualifier = unknown>(
  handler: QueryEventHandler<Data, Qualifier>,
  qualifier?: Qualifier,
  data?: Data,
  error?: any
): QueryEvent<Data, Qualifier> | undefined {
  if (typeof handler === 'function') {
    return handler({ data, qualifier }) as
      | QueryEvent<Data, Qualifier>
      | undefined;
  } else {
    const event: QueryEvent<Data, Qualifier> = {
      type: handler,
      qualifier,
    };
    if (data) {
      event.data = data;
    }
    if (error) {
      event.error = error;
    }
    return event;
  }
}
