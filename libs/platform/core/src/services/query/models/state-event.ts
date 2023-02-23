export interface StateEvent<Data = unknown, Qualifier = unknown> {
  type: string;
  data?: Data;
  error?: any;
  qualifier?: Qualifier;
}
