export interface QueryEvent<Data = unknown, Qualifier = unknown> {
  type: string;
  data?: Data;
  error?: any;
  qualifier?: Qualifier;
}
