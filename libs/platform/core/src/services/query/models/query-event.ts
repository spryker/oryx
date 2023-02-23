export interface QueryEvent<Data = unknown, Qualifier = unknown> {
  type: string;
  data?: Data;
  error?: any;
  qualifier?: Qualifier;
}

export type QueryEventCallback<Data = unknown, Qualifier = unknown> = ({
  data,
  qualifier,
}: {
  data?: Data;
  qualifier?: Qualifier;
}) => QueryEvent | void;

export type QueryEventHandler<Data = unknown, Qualifier = unknown> =
  | string
  | QueryEventCallback<Data, Qualifier>;
