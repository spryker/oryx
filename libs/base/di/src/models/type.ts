// TODO: remove when fix circular dependency utilities <=> di
// eslint-disable-next-line @typescript-eslint/ban-types
export interface Type<T, A extends any[] = any[]> extends Function {
  new (...args: A): T;
  prototype: T;
}
